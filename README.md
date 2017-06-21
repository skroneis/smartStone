
# smartStone home automation with RPi

This project provides a simple Node.js home automation library for the Raspberry Pi.

## Examples ##
- ToDo...
- 

start/stop the Service
----------------
```shell
sudo service smartStone start
sudo service smartStone stop
```

[//]: # (.net: csharp)

### config-samples
```js
module.exports={
    [...]
    'LCDOn': false,
    'LEDsOn': false
};
```

### Patch - wiring-pi
copy node_modules\wiringpi-node\build\Release\WiringPi.node --> node_modules\wiring-pi\build\Release\wiringPi.node
