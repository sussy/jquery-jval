# Super-sexy animated form field validation plugin. #

### "pod" layout: ###
![http://jquery-jval.googlecode.com/files/jVal_0-1-0_pod_ss.jpg](http://jquery-jval.googlecode.com/files/jVal_0-1-0_pod_ss.jpg)

### "cover" layout: ###
![http://jquery-jval.googlecode.com/files/jVal_0-1-0_cover_ss.jpg](http://jquery-jval.googlecode.com/files/jVal_0-1-0_cover_ss.jpg)

Very easy to apply field validation on a per-field basis directly in the html:

```
<input id="f3" type=text size=40
    jVal="{valid:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message:'Invalid Email Address', styleType:'cover'}"
    jValKey="{valid:/[a-zA-Z0-9._%+-@]/, cFunc:'alert', cArgs:['Email Address: '+$(this).val()]}">
```

Very user friendly in showing each field that has not passed validation. Easy support for restriction of characters in a field, i.e. phone number only allowing digits. Allows for associating the ENTER key with a specific function.