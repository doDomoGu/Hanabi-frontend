<template>
    <section>
        <mt-field label="用户名" placeholder="请输入用户名" @keydown.enter.native="onSubmit" v-model="form.username"></mt-field>

        <mt-field label="密码" placeholder="请输入密码" type="password" v-model="form.password" @keydown.enter.native="onSubmit" ></mt-field>

        <mt-button type="default" size="large" @click.native="onSubmit">submit</mt-button>
    </section>
</template>
<script src="@js/index/login.js"></script>