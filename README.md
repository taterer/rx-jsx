# Rx-JSX
A familiar way to develop a front end using JSX without React. Prop drilling and lifecycle events are all replaced with a new RxJS engine.

This example includes a basic router implementation

# Getting started
Install dependencies with `yarn`

Start the app with `yarn start`

For collaborative drawing using sockets, also start the server with `yarn start:server` and set SOCKETS_ENABLED=true in a `.env` file.

# Learn RxJS
Open the site in the browser to see the instructions for the exercises. Each exercise will require code changes, which should be done within the src directory of this repository.

Learn how to use Rx-JSX at https://github.com/taterer/rx-jsx/tree/main/package

# Theory
## Why?
I thought it would be interesting to try using JSX without React, and try to base the application on streams, rather than objects. Though JSX is still a little objecty. The intention for the paradigm is to essentially not use state, but operate functionaly, and derive state at any point that it's needed, sharing pipelines if multiple components rely on similar things.
## Domain Driven Design; Event-Sourcing; CQRS; Reactive
### Separate commands and queries
#### The only way to make changes to anything that might ever be persisted should be through a command in the command file of the corresponding domain directory.
#### The only pipes from command observables should be queries in the adjacent event file.
#### The only subscriptions should be in the application; components and views.
#### Commands and queries should have no side effects,
they should only supply the pipes to do useful things,
it is left to the application to actually do stuff (declarative).
Pipes may not be completely stateless, but should be as pure as possible.

## Random other plans
#### Ensure all subscriptions are preceded with a takeUntil as the last item in the pipe before the subscribe
#### Keep non subscription code blocks outside of the JSX files as much as possible
