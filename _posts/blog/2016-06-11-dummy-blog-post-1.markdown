---
layout: blog
title: "Dummy Blog Post - 1"
date: 2016-06-11 16:54:46
author: Adi Fahmi
categories:
- blog
- Tutorial
- Code-Snippets
img: post03.jpg
thumb: thumb03.jpg
description: This is dummy blog post number 3.
---

<b>Testing GitHub Markdown code block</b> 

```
function test() {
  console.log("notice the blank line before this function?");
}
```

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

<!--more-->

```javascript
function myFunction(p1, p2) {
    return p1 * p2;              // The function returns the product of p1 and p2
}
```

{% highlight php %}
for ($x = 0; $x <= 10; $x++) {
  echo "The number is: $x <br>";
}
{% endhighlight %}

```java
public static int methodName(int a, int b) {
   // body
}
```


>awesome, right?
