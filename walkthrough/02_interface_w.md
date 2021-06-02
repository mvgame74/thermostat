# Walkthrough - Thermostat: interface

[Back to the Challenge](../interface.md)

Working from the code we had in the earlier walkthrough (your code may well be different) and the specification, there are a few input elements that are fairly obvious from the code, as they are functions that represent the thermostat's main API:

- `thermostat.up()`
- `thermostat.down()`
- `thermostat.resetTemperature()`

We also have two functions that control power saving:

- `thermostat.switchPowerSavingModeOn()`
- `thermostat.switchPowerSavingModeOff()`

What is the information that has to be represented to the user? The main thing would be the temperature, in the colour specified. It would probably also help to know whether power saving mode is on. We have a few functions that deal with this:

- `thermostat.getCurrentTemperature()`
- `thermostat.isPowerSavingModeOn()`
- `thermostat.energyUsage()`

Armed with that knowledge, it's time to break out some HTML. You can put this in `index.html` at the top level of your project.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Thermostat</title>
  </head>
  <body>
    <section>
      <h1 id="temperature"></h1>
      <p>
        <button id="temperature-up">+</button>
        <button id="temperature-down">-</button>
        <button id="temperature-reset">reset</button>
        power saving mode is <span id="power-saving-status">on</span>
        <button id="powersaving-on">PSM on</button>
        <button id="powersaving-off">PSM off</button>
      </p>
    </section>
  </body>
</html>
```

Check it in your browser. Ain't it beautiful.

Now, add your thermostat code to the page, with a `<script>` tag just before the closing `<body>` tag.

```html
<script src="src/thermostat.js"></script>
```

Make sure that the HTML elements are all present by trying to play with your thermostat in the console. Nothing will work at this stage - we'll get to that next...
