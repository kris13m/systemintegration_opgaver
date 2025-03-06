#import asyncio
#from websockets.asyncio.client import connect

#def send_message():
#    with connect("ws://localhost:8000") as websocket:
 #       websocket.send("sending a client message from python!")
  #      message = websocket.recv()
   #     print(f"received message from server: {message}")

#message.send()

import asyncio
import websockets

async def send_message():
    uri = "ws://localhost:8000"
    async with websockets.connect(uri) as websocket:
        await websocket.send("sending a client message from python!")
        print(await websocket.recv())

asyncio.get_event_loop().run_until_complete(send_message())

asyncio.run(send_message())