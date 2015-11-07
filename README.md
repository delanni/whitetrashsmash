## Server docs

Join game room: socket.emit('joinRoom', {roomId: roomId, type: 'viewer|controller'});

Game events: All other game events are emitted on the gameEvents channel in the following format:

Example:
```javascript
socket.on('gameEvent', function(data){
            console.log('New game event', data);
          });
```

Message format:
```javascript
{
    type: "welcome",
    sender: "dbeb122b-5b59-445c-9f5b-468e5f1c636c",
    payload: {
        name: "Ophelia Soto"
    },
    timestamp: "2015-11-07T04:07:11.404Z"
}
```

Implemented message types:
- welcome: welcome message to new players
- playerJoin: emitted when new player joined
- playerLeave: emitted when player left

payload in all three cases: 
```javascript
{
    id: connection.id,
    name: connection.name
}
```

## Quick Start

~~~sh
# getting the code
git clone git@github.com:nko5/destructive-internet.git && cd ./destructive-internet/

# developing
npm install
npm start

# setup your modulus account
npm install -g modulus
modulus login

# deploying to Modulus (to http://destructive-internet.2015.nodeknockout.com/)
modulus deploy

# view the most recent logs from modulus
modulus project logs
~~~

Read more about this setup [on our blog][deploying-nko].

[deploying-nko]: http://www.nodeknockout.com/deploying

### Vote KO Widget

![Vote KO widget](http://f.cl.ly/items/1n3g0W0F0G3V0i0d0321/Screen%20Shot%202012-11-04%20at%2010.01.36%20AM.png)

Use our "Vote KO" widget to let from your app directly. Here's the code for
including it in your site:

~~~html
<iframe src="http://nodeknockout.com/iframe/destructive-internet" frameborder=0 scrolling=no allowtransparency=true width=115 height=25>
</iframe>
~~~

## Have fun!

If you have any issues, we're on IRC in #nodeknockout on freenode, email us at
<help@nodeknockout.com>, or tweet [@nodeknockout](https://twitter.com/nodeknockout).
