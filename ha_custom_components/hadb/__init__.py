import logging
import voluptuous as vol
from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers import storage, config_validation as cv, discovery
from homeassistant.const import CONF_NAME
from typing import Optional

STORAGE_KEY = 'hadb'
VERSION = 1

_LOGGER = logging.getLogger(__name__)
DOMAIN = "hadb"

CONFIG_SCHEMA = vol.Schema({
    DOMAIN: vol.Schema({
        vol.Required(CONF_NAME): cv.string,
    })
}, extra=vol.ALLOW_EXTRA)

async def async_setup(hass, config):
    haStore = HaStore(hass)
    hass.http.register_view(StoreView(hass, haStore))
    store = storage.Store(hass, VERSION, STORAGE_KEY)
    hass.data[STORAGE_KEY] = await store.async_load() or {}

    return True

class HaStore:
    def __init__(self, hass):
        self.hass = hass
        self.store = storage.Store(hass, VERSION, STORAGE_KEY)

    async def get(self, key_to_get) -> Optional[str]:
        if key_to_get:
            value = self.hass.data[STORAGE_KEY].get(key_to_get, None)
            return value

        return None

    async def set(self, key_to_set, value_to_set) -> bool:
        if key_to_set is not None:
            self.hass.data[STORAGE_KEY][key_to_set] = value_to_set
            await self.store.async_save(self.hass.data[STORAGE_KEY])
            return True

        return False

    async def delete(self, key_to_remove) -> bool:
        if key_to_remove:
            self.hass.data[STORAGE_KEY].pop(key_to_remove, None)
            await self.store.async_save(self.hass.data[STORAGE_KEY])
            return True

        return False


class StoreView(HomeAssistantView):
    url = "/api/hadb/store"
    name = "api:hadb:store"
    requires_auth = False

    def __init__(self, hass, haStore):
        self.hass = hass
        self.store = haStore

    async def get(self, request):
        key_to_get = request.query.get('key')
        if key_to_get:
            value = await self.store.get(key_to_get)
            return web.json_response({"data": value}, headers={

            })

        return web.json_response({"status": "key not provided"}, status=400)

    async def post(self, request):
        data = await request.json()
        key_to_set = data.get("key")
        value_to_set = data.get("value")

        if key_to_set is not None:
            await self.store.set(key_to_set, value_to_set)
            return web.json_response({"status": "ok"}, headers={

            })

        return web.json_response({"status": "key or value not provided"}, status=400)

    async def delete(self, request):
        key_to_remove = request.query.get('key')
        if key_to_remove:
            await self.store.delete(key_to_remove)
            return web.json_response({"status": "deleted"})

        return web.json_response({"status": "key not provided"}, status=400)
