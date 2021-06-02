# Walkthrough - Thermostat: business logic

[Back to the Challenge](../thermostat_logic.md)

So let's start with the customer's requirements:

1. Thermostat starts at 20 degrees
2. You can increase the temp with an up function
3. You can decrease the temp with a down function
4. The minimum temperature is 10 degrees
5. If power saving mode is on, the maximum temperature is 25 degrees
6. If power saving mode is off, the maximum temperature is 32 degrees
7. Power saving mode is on by default
8. You can reset the temperature to 20 with a reset function
9. You can ask about the thermostat's current energy usage: < 18 is `low-usage`, <= 25 is `medium-usage`, anything else is `high-usage`.
10. (In the challenges where we add an interface, low-usage will be indicated with green, medium-usage indicated with black, high-usage indicated with red.)

### The First Test

When given a new project, sometimes it's tough to know where to begin. However, in this case it seems simple that the most useful but basic Thermostat would be able to at least read the current temperature. So let's start with #1 for our first test:


```javascript
// spec/thermostatSpec.js

'use strict';

describe('Thermostat', () => {

  let thermostat;

  beforeEach(() => {
    thermostat = new Thermostat();
  });

  it('starts at 20 degrees', () => {
    expect(thermostat.temperature).toEqual(20);
  });
});
```

You might have noticed we're going to use **strict mode**, which you can read up on here: [MDN - Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). To invoke strict mode, place this at the top of your files:

```javascript
'use strict';
```
This is purely to encourage us to write a higher standard of JavaScript. We are also engaging in a little premature optimisation here by adding the `beforeEach` but this is going to be added to soon enough.

So our expectation here, is that upon creation, our `thermostat` will default to a `temperature` of 20. But Jasmine disagrees! Let us convince it by creating our *object constructor function*:

```javascript
// src/thermostat.js

'use strict';

class Thermostat{};
```

This enables us to actually make instances of the `Thermostat` object by running `new Thermostat()`. Now we need to give it a property that holds the current temperature, so that we can always refer back to it:

```javascript

class Thermostat {
  constructor() {
    this.temperature = 20;
  }
}
```

Now when we refresh our `SpecRunner.html` file in the browser, we get NTB (Nuthin' But Green)! Our test is passing, and life is good :sunrise:

So here we should notice two things:
1. Our `temperature` property is situated between the `{}` of our `Thermostat` object constructor function.
2. The `this` keyword is employed.

In regards to #1, it's enough right now to be aware that this is where we store the property of an object. However, #2 is going to involve a [little bit of research on your part](http://javascriptissexy.com/understand-javascripts-this-with-clarity-and-master-it/). As a quick summary though, `this` tells the JavaScript interpreter that `temperature` belongs to `Thermostat`.

At this point you might be asking why we are allowing access directly to a variable from outside of our `Thermostat` object rather than using a getter method to read from it - and you'd be right. So let's refactor our test and code a little to allow for this.

```javascript
// spec/thermostatSpec.js

  it('starts at 20 degrees', () => {
    expect(thermostat.getCurrentTemperature()).toEqual(20);
  });
```

Notice how we place parenthesis at the end. Why? This is to communicate to the JavaScript interpreter that we want it to execute this function, as opposed to returning the function itself.

And now to create our method. As you will have noticed, we place the _properties_ of an object "inside" that object. However, when we are writing methods that relate to the same object, we use a different technique:

### Creating a method


```javascript
class Thermostat {
  constructor() {
    this.temperature = 20;
  }
  getCurrentTemperature() {
  }
}
```

Now, we want `getCurrentTemperature()` to return the current temperature of Thermostat, and we achieve this using the following:

```javascript

class Thermostat {
  constructor() {
    this.temperature = 20;
  }
  getCurrentTemperature() {
    return this.temperature;
  }
};
```

Now is a fantastic opportunity to take stock of what we have learned here. Firstly, we have created a `Thermostat` **object constructor**, and given it a **property** of `temperature` and then we added a `getCurrentTemperature` function to our `Thermostat` to access the `temperature` property.

### But what about my privacy?

So as you may notice, we can still access `Thermostat.temperature` if we want to. In Ruby, all we would need to do is put the relevant method after the `private` keyword and access is restricted for us. However, JavaScript has no intention of making life this easy for us.

Google Developer Philip Walton has written an interesting blog post on private members in JavaScript:

"Privacy has been a complicated issue throughout JavaScript’s history.
While it’s always been possible to meet even the most stringent privacy needs (the myriad of compile-to-js languages proves this), the extraneous ceremony required to really do it right is often too much of a turn-off for most developers — especially to those coming from other languages where privacy is built in."

You can read the article [here](http://philipwalton.com/articles/implementing-private-and-protected-members-in-javascript/) - there really are a lot of hoops to jump through when you compare the luxurious simplicity that Ruby provides for us. This is where you start to see how when jumping between languages you will be confronted by differences in languages that force us to compromise our expectations of a language.

In this case, we're going to leave the code as is so you can see the contrast between approaches (see [Tansaku's solution for AirportsJS](https://github.com/tansaku/airport_js )), and for simplicity since we have a lot to get through with this walkthrough!

### It's getting hot in here

So the only sensible thing to do now is to turn the temperature up! Let's write a test:

```javascript
// spec/thermostatSpec.js

  it('increases in temperature with up()', () => {
    thermostat.up();
    expect(thermostat.getCurrentTemperature()).toEqual(21);
  });
```

Now, we're at the point where most of the surprising parts of the syntax are out of the way. As a programmer you have developed enough of an understanding to realise that at this point we need to write a method which increases the value of `thermostat.temperature` each time we run it. So with that in mind, I'm going to lay the solution out for your reference:

```javascript
class Thermostat {
  constructor() {
    this.temperature = 20;
  }
  getCurrentTemperature() {
    return this.temperature;
  }
  up() {
    this.temperature += 1
  }
}
```

And so by that logic, decreasing the temperature should be a snip!

```javascript
// spec/thermostatSpec.js

it('decreases in temperature with down()', () => {
  thermostat.down();
  expect(thermostat.getCurrentTemperature()).toEqual(19);
});
```

Our implementation should follow that of our `up()` function:

```javascript
class Thermostat {
  constructor() {
    this.temperature = 20;
  }
  getCurrentTemperature() {
    return this.temperature;
  }
  up() {
    this.temperature += 1
  }
  down() {
    this.temperature -= 1
  }
}
```

At this point I would dare to venture we have a pretty decent MVP. We have something that keeps a record of the current temperature, and can either increase or decrease it. Magic!

However, sometimes people need protection from themselves. I'm sure you all know someone who is likely to boil themselves alive because they get a little 'trigger-happy' around buttons (or perhaps even method calls...). Plus our client has stipulated that there should be some limits on our temperature ranges.

![](http://fullnomad.com/wp-content/uploads/2015/08/make-it-so.png "The Customer says 'Make it so.'")

### Limiting the temperature

Our client has chosen 10 degrees as the minimum temperature our users should be able to set the Thermostat to.

```javascript
// spec/thermostatSpec.js

it('has a minimum of 10 degrees', () => {
  for (let i = 0; i < 11; i++) {
    thermostat.down();
  }
  expect(thermostat.getCurrentTemperature()).toEqual(10);
});
```

Now given that our `thermostat` has a default `temperature` of 20, and we want to test that we can't go more than 10 degrees below that default, here we employ a loop to handle the cumbersome test setup of calling `thermostat.down` eleven times. This is probably one of the first times you're seeing a loop used in a test, and again we're reminded of the convenience that Ruby brings to the table.

It's at this point we have a good case for adding another property to our object constructor function:

```javascript
// src/thermostat.js

'use strict';

constructor() {
    this.MINIMUM_TEMPERATURE = 10;
    this.temperature = 20;
  }
```

Notice how I'm using capital letters for the property name? As you might probably have realised, I intend this value to be a constant, and am marking that intention in the use of capitalization. It does not freeze the value, merely communicates intent to the next Developer.

Armed with this new property, let us create a method to return a boolean check on whether or not the temperature is currently set to the `MINIMUM_TEMPERATURE` inside our class:

```javascript
// src/thermostat.js
  isMinimumTemperature() {
    return this.temperature === this.MINIMUM_TEMPERATURE;
  }
```

See how our function name here begins with `is`? This is another convention, notifying the Developer after me that I intend this function to always return a boolean value, where in Ruby we would put a `?` at the end of the method name. Also note the triple `=` sign. If you're not sure why this is necessary, I would heartily recommend [this article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).

And now let's edit our `down()` function to take advantage of this new temperature check:

```javascript
// src/thermostat.js

down() {
    if (this.isMinimumTemperature()) {
      return;
    }
    this.temperature -= 1
  }
```

So now we have a kind of guard condition before we are allowed to decrease our temperature!

### Power Saving Mode

Seeing as we have just limited the decrement temperature part of the spec, it might be tempting to now do the inverse and create a limit for the maximum temperature - and that would be absolutely fine.

However, a little further down our client's list of demands we can see that there is a Power Saving Mode (PSM) which means that the maximum temperature can shift depending on this setting. Therefore it's not too much of a stretch to imagine that in order to limit the temperature to a maximum we will need to implement PSM first, so that we know which temperature limit to check against.

Now our spec says that PSM should be activated by default, so let's go ahead and write a test for this:

```javascript
// spec/thermostatSpec.js

it('has power saving mode on by default', () => {
  expect(thermostat.isPowerSavingModeOn()).toBe(true);
});
```

Which leads us to the understanding that we will require a new property, and a new getter method to read that property:

```javascript
// src/thermostat.js

'use strict';

constructor() {
  // Other properties omitted for brevity
  this.powerSavingMode = true;
}
```

and our getter method:

```javascript
// src/thermostat.js
isPowerSavingModeOn() {
    return this.powerSavingMode === true;
}
```

Great! Now in order to make this PSM business a viable proposition, we need the ability to switch it on and off. Since it's on by default, let's make our next step to turn it off:

```javascript
// spec/thermostatSpec.js

it('can switch PSM off', () => {
  thermostat.switchPowerSavingModeOff();
  expect(thermostat.isPowerSavingModeOn()).toBe(false);
});
```

Since we already have the `powerSavingMode` property to work with, lets get straight to our function:

```javascript
// src/thermostat.js

switchPowerSavingModeOff() {
    this.powerSavingMode = false;
  }
```

Which is super-easy to reverse for our `switchPowerSavingModeOn` method (which you just _knew_ was around the corner!):

```javascript
// spec/thermostatSpec.js

it('can switch PSM back on', () => {
  thermostat.switchPowerSavingModeOff();
  expect(thermostat.isPowerSavingModeOn()).toBe(false);
  thermostat.switchPowerSavingModeOn();
  expect(thermostat.isPowerSavingModeOn()).toBe(true);
});
```

And so goes our function:

```javascript
// src/thermostat.js

switchPowerSavingModeOn() {
  this.powerSavingMode = true;
}
```

And there we go! Power Saving Mode is in effect and ready to go! Now to get back to our temperature-limiting activities...

### The Upper limits

So if we refer back to our client's wishes, we are required to limit the temperature as follows:

* To 25 degrees when PSM is activated
* to 32 degrees when PSM is off

So we are going to revisit our incremental function `up()`. But not before we write a test. No, never before we write a test precious:

```javascript
// spec/thermostatSpec.js

describe('when power saving mode is on', () => {
  it('has a maximum temperature of 25 degrees', () => {
    for (let i = 0; i < 6; i++) {
      thermostat.up();
    }
    expect(thermostat.getCurrentTemperature()).toEqual(25);
  });
});
```

Did you spot that we have used a nested `describe()` here? In Jasmine there is no equivalent to RSpec's `context()` so we have to make do. But it does make our test output more readable so it's ok. So, let's make sure our test setup cannot increase the temperature to 26 when PSM is off. To do so, let's crack open our old friend `up()`:

```javascript
// src/thermostat.js

up() {
  if (this.isMaximumTemperature()) {
    return;
  }
  this.temperature += 1;
}
```

Make sense? If our current temperature is already set to the maximum limit, we do nothing - otherwise we turn it up. However, this does necessitate a new method to check on how our current temperature compares against 1.) Our PSM status, and 2.) our maximum limit for that setting.

If I were a fortune teller, I would gaze into my crystal ball and tell you that we are going to need a couple of extra properties in our object constructor function:

```javascript
// src/thermostat.js

'use strict';

class Thermostat {
  constructor() {
    // Other properties omitted for brevity
    this.MAX_LIMIT_PSM_ON = 25;
    this.MAX_LIMIT_PSM_OFF = 32;
  }

  // ...
}
```

Wünderbar! Now `isMaximumTemperature()` will make a LOT more sense :wink:

```javascript
// src/thermostat.js

isMaximumTemperature() {
  if (this.isPowerSavingModeOn() === false) {
    return this.temperature === this.MAX_LIMIT_PSM_OFF;
  }
  return this.temperature === this.MAX_LIMIT_PSM_ON;
}
```

So to sum up, we have:

* a maximum temperature limit when PSM is on (25)
* and when it is off (32)
* a function to determine if the current temperature is at the maximum for the current PSM status
* and a refactored `up()` method which takes into account the `isMaximumTemperature()` return value

To make sure our logic is sound, let us write a counter test to make doubley-sure:

```javascript
// spec/thermostatSpec.js

describe('when power saving mode is off', () => {
  it('has a maximum temperature of 32 degrees', () => {
    thermostat.switchPowerSavingModeOff();
    for (let i = 0; i < 13; i++) {
      thermostat.up();
    }
    expect(thermostat.getCurrentTemperature()).toEqual(32);
  });
});
```

Do our tests pass? Of course they do! Did you have any doubt?

### Reset!

Oh yes, that's right! Le Client wanted us to have a reset method to bring us back to the default temperature! Well, who are we to argue:

```javascript
// spec/thermostatSpec.js

it('can be reset to the default temperature', () => {
  for (let i = 0; i < 6; i++) {
    thermostat.up();
  }
  thermostat.resetTemperature();
  expect(thermostat.getCurrentTemperature()).toEqual(20);
});
```

In this situation we could create a method that does the following:

```javascript
// src/thermostat.js

resetTemperature() {
  this.temperature = 20;
}
```

However, this is a little nasty. It contains a [MAGIC NUMBER](http://blog.silvabox.com/testing-with-magic-numbers/) (20). Boo. Hiss. I mean, there's nothing inherently wrong with the number twenty - but if a Developer were just to see that method out of context, it would not be _immediately_ obvious what we were going for with that number. And the goal, is to have code that **screams** its intent.

Besides that, in terms of maintenance, if we decide the default temperature is going to be say, 21, we have to change it in two places now. And as we know, a good Dev is a lazy Dev. Let's  go back to our object constructor function and do a little refactor:

```javascript
// src/thermostat.js

'use strict';

class Thermostat {
  constructor() {
    // Other properties omitted for brevity
    this.DEFAULT_TEMPERATURE = 20;
    this.temperature = this.DEFAULT_TEMPERATURE;
  }

  // ...
}
```

This means we can tidy up our `resetTemperature()` function rather nicely:

```javascript
// src/thermostat.js

resetTemperature() {
  this.temperature = this.DEFAULT_TEMPERATURE;
}
```

See? SO MUCH BETTER! :heart: We are so nearly there. Just one more feature...

### Energy usage

The last requirement our client has given us, is that we should be able to demonstrate to our user where their energy usage sits.  We are going to have a function that outputs `high-usage`, `medium-usage` or `low-usage`.

With that, let's write our final tests:

```javascript
// spec/thermostatSpec.js

describe('displaying usage levels', () => {
  describe('when the temperature is below 18 degrees', () => {
    it('it is considered low-usage', () => {
      for (let i = 0; i < 3; i++) {
        thermostat.down();
      }
      expect(thermostat.energyUsage()).toEqual('low-usage');
    });
  });

  describe('when the temperature is between 18 and 25 degrees', () => {
    it('it is considered medium-usage', () => {
      expect(thermostat.energyUsage()).toEqual('medium-usage');
    });
  });

  describe('when the temperature is anything else', () => {
    it('it is considered high-usage', () => {
      thermostat.powerSavingMode = false;
      for (let i = 0; i < 6; i++) {
        thermostat.up();
      }
      expect(thermostat.energyUsage()).toEqual('high-usage');
    });
  });
});
```

Bearing in mind that we're saying 'anything else' temperature-wise is going to count as 'high-usage', we don't need to think about that setting. That means that we only have two temperature breakpoints to worry about:

* below 25 (which also happens to be our maximum temperature when PSM is ON)
* below 18

```javascript
// src/thermostat.js

class Thermostat {
  constructor() {
    // Other properties omitted for brevity
    this.MEDIUM_ENERGY_USAGE_LIMIT = 18;
    this.HIGH_ENERGY_USAGE_LIMIT = 25;
  }

  // ...
}
```

Now we have everything we could need to construct a function able to tell us where we lay, in the grand scheme of energy consumption:

```javascript
// src/thermostat.js

energyUsage() {
  if (this.temperature < this.MEDIUM_ENERGY_USAGE_LIMIT) {
    return 'low-usage';
  }
  if (this.temperature <= this.HIGH_ENERGY_USAGE_LIMIT) {
    return 'medium-usage';
  }
  return 'high-usage';
}
```