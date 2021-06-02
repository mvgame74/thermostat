# Walkthrough - Thermostat: DOM

[Back to the Challenge](../dom.md)

You don't need to include anything to use the browser's DOM functions - they're built right into the browser!

Before you address the thermostat, make sure that you understand some basic DOM concepts: `document.querySelector`, `document.querySelectorAll`, event listeners (`.addEventListener`), and callbacks.

#### DOMContentLoaded

This utility function translates to "only execute the function when the document is ready", i.e. when the DOM is loaded. This is a good idea because it's difficult (but not impossible!) to attach an event listener to something that isn't there. Forgetting to wrap code in this is a common source of bugs.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // Execute this code when the page is fully loaded
});
```

#### DOM selectors

The DOM selector generally works like this:

```javascript
document.querySelector('element')
```

where `element` is a CSS selector, or a tag name. Chrome Dev Tools actually comes with a very similar feature, so you can try it out on any page. Try selecting some `.classes`, `#ids` and HTML tags.

#### Event listeners

In longhand, these usually look like

```javascript
document.querySelector('element').addEventListener('some event name', () => {
  // do something
})
```

where `event` is an action you would like to listen for on the page. Popular events include clicks, scrolls, typing and generally any kind of page interaction.

#### Callbacks

Callback are generally a source of massive confusion, so this explanation will be a simplistic explanation suitable for understanding what role they play in event listeners. You've actually been using them in Jasmine without even knowing! The callback is the anonymous function passed as last argument to the event handler:

```javascript
document.querySelector('#some-heading').addEventListener('event', () => {
  // this function is the callback!
})
```

In this case, the callback is the function passed in second argument to the `addEventListener` function, that executes at some point in the future. The plain English translation would be "when there is a click on the element with the ID `some-heading`, run the function".

Enough theory! Let's start by getting the initial temperature to display when the page loads.

>This walkthrough is written with one possible workflow when developing UIs with the DOM API, which may or may not be to everyone's personal taste. Try it out though and see what you think.

Bust out the console, and find the element to be manipulated using the DOM selector.

```javascript
// console
document.querySelector('.temperature') // null - nope
document.querySelector('#tamparatare') // null - you drunk?
document.querySelector('#temperature') // <h1 id="temperature"></h1> - bingo!
```

Now build up what you're trying to do. We want to manipulate the text of this `h1`, so find the right DOM function. The DOM API is such a vast library that if you type what you think you're trying to do into the documentation, there's probably a function or an attribute to do it. You're trying to alter the text, so let's see if that works.

```javascript
// console
const temperatureEl = document.querySelector('#temperature')
temperatureEl.innerText = "Hello DOM world!"
```

Success! We want to set this to the thermostat's temperature, so we'll need a new thermostat.

```javascript
// console
const thermostat = new Thermostat();

// we can shorten the two lines of the previous example in one:
document.querySelector('#temperature').innerText = "Hello DOM world!"
```

Now we can put this in our actual interface file, wrapped in a `document.addEventListener("DOMContentLoaded", {})`, so that it only triggers when the DOM has finished loading.

```javascript
// interface.js
document.addEventListener("DOMContentLoaded", () => {
  const thermostat = new Thermostat();
  document.querySelector('#temperature').innerText = thermostat.temperature
})
```

Let's go for something a bit more complex, like changing the temperature. We can attach **event listeners** to elements in the DOM, allowing the page to react to user input. The functions we want to run when the event happens are passed in an **anonymous function** (which in this case is also a **callback**). Those terms in bold are important, but we'll get to them once our thermostat does stuff!

Take a second to think about the flow of what happens when a user interaction happens:

**user input -> event listener -> update model -> update view to reflect change in model**

In code:

```javascript
document.querySelector('#temperature-up').addEventListener('click', () => { // event listener
  thermostat.up(); // update model
  document.querySelector('#temperature').innerText = thermostat.temperature; // update view
})
```

And the same again for decreasing the temperature:

```javascript
document.querySelector('#temperature-down').addEventListener('click', () => {
  thermostat.down();
  document.querySelector('#temperature').innerText = thermostat.temperature;
})
```

Looks like there's something repeated 3 times, so it's probably time to refactor updating the temperature to its own clearly-named function:

```javascript
const updateTemperature() = () => {
  document.querySelector('#temperature').innerText = thermostat.temperature;
}
```

Hooking the other buttons up should be relatively straightforward, resulting in something like this:

```javascript
// interface.js
document.addEventListener("DOMContentLoaded", () => {
  const updateTemperature() = () => {
    document.querySelector('#temperature').innerText = thermostat.temperature;
  }

  const thermostat = new Thermostat();
  updateTemperature();

  document.querySelector('#temperature-up').addEventListener('click', () => {
    thermostat.up();
    updateTemperature();
  });

  document.querySelector('#temperature-down').addEventListener('click', () => {
    thermostat.down();
    updateTemperature();
  });

  document.querySelector('#temperature-reset').addEventListener('click', () => {
    thermostat.resetTemperature();
    updateTemperature();
  });

  document.querySelector('#powersaving-on').addEventListener('click', () => {
    thermostat.switchPowerSavingModeOn();
    document.querySelector('#power-saving-status').innerText = 'on';
    updateTemperature();
  })

  document.querySelector('#powersaving-off').addEventListener('click', () => {
    thermostat.switchPowerSavingModeOff();
    document.querySelector('#power-saving-status').innerText = 'off';
    updateTemperature();
  })
});
```

The last piece of the puzzle is to colour the display according to the energy usage. As you saw when building the business logic, the JavaScript code wasn't responsible for presentation. It might be tempting to do something like this:

```javascript
const updateTemperature = () => {
  document.querySelector('#temperature').innerText = thermostat.temperature;
  if (thermostat.energyUsage() === 'low-usage') {
    document.querySelector('#temperature').style.color = 'green';
  } else if (thermostat.energyUsage() === 'medium-usage') {
    document.querySelector('#temperature').style.color = 'black';
  } else {
    document.querySelector('#temperature').style.color = 'red';
  }
}
```

What's wrong with this code? Firstly, there's a big `if/else if/else` statement, which is usually a code smell. Secondly, there's subtle duplication - this is just a repeat of the logic within the thermostat itself. Thirdly, you can see that the code is very interested in CSS - so, why not delegate to the CSS itself, and just change the class so that the CSS can decide how to handle colour?

```javascript
const updateTemperature = () => {
  document.querySelector('#temperature').innerText = thermostat.temperature;
  document.querySelector('#temperature').className = thermostat.energyUsage();
}
```

And now the CSS can handle colour (don't forget to place this in its own file and link it in with the appropriate tag):

```css
.low-usage {
  color: green;
}

.medium-usage {
  color: black;
}

.high-usage {
  color: red;
}
```
