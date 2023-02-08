# Overview

I've tried to make the book building process both straightforward and highly customizable. On the most basic level it is just a JSON file. To know how to build pages to the books you will have to know how the book pages are rendered to the console, but you won't have to be a programer to make them. I'd recommend having `small_example_adventure_text_array.json` open as a guide.

## Making a Book

## Making Pages

I find it helpful to conceptualize the json files as books and sections of the json files as pages. That is to say I would consider `small_example_adventure_text_array.json` to be a book, and would consider a page in that book to look like this:

```
 {
    "short_name": "",
    "ID": 0,
    "text_array": [" "]
  },
```

That is an empty page, but it has the bones of everything a page would need. Within these books, there are two kinds of pages: meta pages and game pages. Meta pages contain info on how the book works or should be rendered; think of these as the front matter of a traditional book. Game pages just contain text you want shown to the player when they `turn to` that page. Each of these have some nuance I'll get into below, but all pages **need to have the both the `short_name` and the `ID` tags in them to work properly!** Furthermore, `ID` tags need to be _unique_ throughout the book, even if you don't think you are using that page.

### Meta Pages

There are currently two supported meta pages; one called `meta` and one called `on-load`. To build either of these pages you just need to set their `id` tags to `meta` or `on-load` depending on which one you are defining.

The `meta` page is a great place to store information such as the author of the book, the revision number, etc. It is made specifically to hold meta-data. It is also where you can define custom css to be used when rendering your book. I would caution against trying to mutate the classes in the css of the whole project, but you can define custom classes to use in `<span>` tags in the game pages.

The `on-load` page is really just a predefined game page. Set it up the same way you would setup a game page, it will print it's text-array if the `on-load` page exists and it has a `text-array` property. As soon as the book is able to successfully load, it will give the player the `on-load` message.

### Game pages

Game pages are very straightforward. It's just the three properties: `short_name`, `ID`, and `text_array`.

When a room is rendered to the console, it will show up as:

```
>> ID short_name
   text_array
```

For example, the room:

```
  {
    "short_name": "Entryway",
    "ID": 1,
    "text_array": [
      true,
      "This room is the first room at the player should enter.",
      false,
      "</br>",
      true,
      "From the entrance way you can go south to the t-junction ",
      false,
      "(#2)."
    ]
  }
```

would render as:

```
>> 1 Entryway
   This room is the first room the player should enter.
   From the entrance way you can go south to the t-junction (#2)
```

#### What is `ID`?

When the player gives a `goto [x]` or a `turn to [x]` command, the system will look for a room with that `ID`. It will be in lowercase so a `goto Entryway` will be evaluated as `goto entryway`, so don't capitalize any room `ID`s. It does, however, respect spaces and treats them as a string, so you can name them '1', 'one', 'the first room', or whatever you wish as long as it is valid lowercase JSON.

#### What is `short_name`?

`short_name` is optional text to display directly after the page ID is rendered in the console. It is never needed, but is a way to help pages feel more distinct to players.

#### What is `text_array`?

`text_array` is the bulk of the text that will be displayed as a page is loaded. Every line of text you wish to include must be part of a pair. A boolean indicating if you want the text printed or typed, and then the text you wish to display as a string. If you want it printed character by character, tag it as `true`. If instead you want it printed, i.e. it all shows up at the same time, tag it as `false`.

Let's say you want to make a page that would display:

```
>> 92
   This is the 92nd room. I feel as though I am being
   .
   .
   watched.

   Turn to page 11.
```

The first thing to do is consider it line by line. The first thing is the `>> 92` line. This is just the `ID` and `short_name` properties, so we'll skip it for now. The other lines we want are, in order, `This is the 92nd room. I feel as though I am being`, `.`, `.`, `watched.`, an empty line, and `Turn to page 11`.

Let's start by putting those into an array like so:

```
"text_array" = [
    "This is the 92nd room. I feel as though I am being",
    ".",
    ".",
    "watched.",
    "",
    "Turn to page 11"
]
```

Then we need to indicate if we want each line printed or typed. We'll type each line except for `watched`. We'll print that one to give it more emphasis. This gives us:

```
"text_array" = [
    true, "This is the 92nd room. I feel as though I am being",
    true, ".",
    true, ".",
    false, "watched.",
    true, "",
    true, "Turn to page 11"
]
```

If we were to try and use this we would get:

```
>> 92
   This is the 92nd room. I feel as though I am being..watched.Turn to page 11
```

This is, of course, not what we are after. This is because we didn't add any line breaks. Lets add those now.

```
"text_array" = [
    true, "This is the 92nd room. I feel as though I am being",
    true, "</br>",
    true, ".",
    true, "</br>",
    true, ".",
    true, "</br>",
    false, "watched.",
    true, "</br>",
    true, "",
    true, "</br>",
    true, "Turn to page 11"
]
```

If we run this we get:

```
>> 92
   This is the 92nd room. I feel as though I am being</br>.</br>.</br>watched.</br></br>Turn to page 11
```

This happens because `</br>` is a special HTML tag. If we add it one character at a time, we wont have a `</br>` added, instead we get a `<`, then a `/` and so on. Lets edit those tags to print them instead of typing them:

```
"text_array" = [
    true, "This is the 92nd room. I feel as though I am being",
    false, "</br>",
    true, ".",
    false, "</br>",
    true, ".",
    false, "</br>",
    false, "watched.",
    false, "</br>",
    true, "",
    false, "</br>",
    true, "Turn to page 11"
]
```

This finally give us what we want:

```
>> 92
   This is the 92nd room. I feel as though I am being
   .
   .
   watched.

   Turn to page 11.
```

There are other special tags you can use in the `text_array`s, see below.

#### How to I use special html tags in `text_array`?

[TODO]
Here I want to restate the `</br>` method from above, talk about spans and how they can be used to style and keep the typing effect, and then talk about making tables like I did with the `help` command
