<template>
    <div id="register">
        <mt-field label="用户名" placeholder="请输入用户名" @keydown.enter.native="onSubmit" v-model="form.username"></mt-field>

        <mt-field label="密码" placeholder="请输入密码" type="password" v-model="form.password"></mt-field>

        <mt-field label="密码确认" placeholder="请再次输入密码确认" type="password" v-model="form.password2"></mt-field>

        <mt-button id="registerBtn" type="default" size="large" @click.native="onSubmit">注册</mt-button>
    </div>
</template>
<script src="@js/index/register.js"></script>
<style lang="scss" src="@css/index/register.scss"></style>
