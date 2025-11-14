# F\# Programming

I’ve started to learn the functional programming language F#, something totally different to what I’m used to.

Here’s a simple example of what the code looks like, this program works out the roots of a quadratic equation.

```fsharp
#light

let quadratic r =
    let a = 2.0
    let b = 3.0
    let c = 5.0

    let disc a b c =
        b * b - 4.0 * a * c

    let x = b * -1.0

    let x =
        match r with
        | 1 -> x + (disc a b c)
        | 2 -> x - (disc a b c)

    let y = 2.0 * a
    let x = x / y

    x

printfn "The first root is %A" (quadratic 1)
printfn "The second root is %A" (quadratic 2)
```
