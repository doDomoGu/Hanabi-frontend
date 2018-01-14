<template>
    <div id="login">
        <mt-field label="用户名" placeholder="请输入用户名" @keydown.enter.native="onSubmit" v-model="form.username"></mt-field>

        <mt-field label="密码" placeholder="请输入密码" type="password" v-model="form.password" @keydown.enter.native="onSubmit" ></mt-field>

        <mt-button id="loginBtn" type="default" size="large" @click.native="onSubmit">登录</mt-button>
    </div>
</template>
<script src="@js/index/login.js"></script>
<style src="@css/index/login.scss"></style>