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

That is an empty page, but it has the bones of everything a page would need. Within these books, there are two kinds of pages: meta pages and game pages. Meta pages contain info on how the book works or should be rendered; think of these as the front matter of a traditional book. Game pages just contain text you want shown to the player when they `turn to` that page. Each of these have some nuance I'll get into below, but both pages will **need to have the `short_name`, `ID`, and `text_array` tags in them to work properly!** Furthermore, `ID` tags need to be *unique* throughout the book, even if you don't think you are using that page. 

### Meta Pages


### Game pages
