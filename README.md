# vue-auth
A simple authencation library for Vue.js

1. register
   ```
   import Vue from 'vue';
   import Auth from 'vue-auth';
   Vue.use(Auth, {
     is: (value) => (['aaa', 'bbb'].includes(value))
   });
   ```
2. function

   To control the element dom exsit or not, for frontend authentication.

3. three ways to use
- use global api `vm.$auth.is(code)`

  ```
  function is (code) {
    return this.$auth.is(code);
  }
  ```


- use directive `v-auth`

  ```
  <div>
    <a-component v-auth="'aaa'">ssss</a-component>
    <b-component v-auth.else>dddd</b-component>
  </div>
  ```


- use component `auth-panel`  (recommend)

  ```
  <auth-panel code="aaa">
    <a-component>ssss</a-component>
    <b-component slot="else">dddd</b-component>
  </auth-panel>
  ```