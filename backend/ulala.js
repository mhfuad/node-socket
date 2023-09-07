

const test = (eventEmitter) => {
    eventEmitter.emit("event-emiter", "hello");
}

module.exports = {
    test : test
}