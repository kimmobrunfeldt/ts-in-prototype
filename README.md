# How 'in' check might fail

This repo is an example of why I think using `obj.hasOwnProperty('key')`
instead of `'key' in obj` is better and more predictable.

For a long time, JS developers have been recommending to use `hasOwnProperty` check
to avoid nasty prototype surprises when checking if an object has a key defined. 
Currently it seems that in TS, the recommended way ([example 1](https://stackoverflow.com/questions/49707327/typescript-check-if-property-in-object-in-typesafe-way), [example 2](https://www.reddit.com/r/typescript/comments/d3mko0/typescript_still_complains_after_hasownproperty/f042nym/), [example 3](https://stackoverflow.com/questions/58960077/how-to-check-if-a-strongly-typed-object-contains-a-given-key-in-typescript-witho))  
to do this check is using `in`
operator, since it provides correct type signature. However it also changes
the behavior of the check in a crucial way that should be understood.

## The problem

When object's [prototype chain](https://medium.com/@chamikakasun/javascript-prototype-and-prototype-chain-explained-fdc2ec17dd04) has an overlapping value
defined, you get unexpected results.

Let's say your API responds with an object where `main` attribute is optional. It might be set as true or not exist:

```json
{ "main": true }
```

and you check that the API response contains the value with `'main' in body`. If the prototype chain has `main` attribute set, your check
might return true, even though the body response itself didn't have the `main` attribute.

### Run the example

```bash
git clone https://github.com/kimmobrunfeldt/ts-in-prototype
cd ts-in-prototype
npm i
npx ts-node test.ts
``` 

and then look how testHasOwn.ts works.



## Solution

The solution is to use your own typed `hasOwnProperty` check as guided in this post: https://fettblog.eu/typescript-hasownproperty/.
This is used in [testHasOwn.ts](testHasOwn.ts)

Read more from TS issues:

* https://github.com/microsoft/TypeScript/issues/18282
* https://github.com/microsoft/TypeScript/issues/10485



## Details

The difference between the checks are that `in` also checks the object prototype
chain, while `hasOwnProperty` doesn't:

> All descendents of Object inherit the hasOwnProperty method. 
> This method can be used to determine whether an object has the 
> specified property as a direct property of that object; unlike the in 
> operator, this method does not check for a property in the object's prototype 
> chain. If an Object is an Array, hasOwnProperty  method can check whether 
> an index exists.

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasownproperty

