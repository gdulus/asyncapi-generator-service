# asyncapi-generator-service

Simple HTTP wrapper around [AsyncAPI generator](https://www.asyncapi.com/tools/generator).

### API

--------------------------------------
#### Generate html-template files


```
POST /asyncapi?src=<URL>
```

Generates html-template files of AsyncAPI documentation.
Parameter `src` is mandatory in format of valid URL under which documentation can be found

response:

```
{
    "id":<String>,
    "version":<String>,
    "files":Array<String>
}
```
--------------------------------------
#### Load file


```
GET /asyncapi/file?id=<String>?id=<String>&version=<String>&file=<String>
```

Returns specific file generated by `POST /asyncapi?src=<URL>` call.

response:

```
{
    "id":<String>,
    "version":<String>,
    "file":<String>,
    "body":<String>
}
```