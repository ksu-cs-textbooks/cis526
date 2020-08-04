Node actually defines multiple log functions corresponding to different _log levels_, indicating the importance of the message.  These are (in order of severity, least to most):

1. `console.debug()`
2. `console.info()`
3. `console.warn()`
4. `console.error()`

These are all aliases for `console.log()` (`console.debug()` and `console.info()`) or `console.error()` (`console.warn()` and `console.error()`).  They don't really do anything different, which might lead you to wonder why they exist...

But remember, JavaScript is a _dynamic_ language, so we can re-define the `console` object with our own custom implementation that _does_ do something unique with these various versions.  But because they exist, they can _also_ be used with the built-in console.  This way our code can be compatible with both approaches!