<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
                <!-- 登录表单区域 -->
            </div>
            <div >
                <el-form v-if="showCompany" ref="loginFormRef" :rules="loginFormRules" :model='loginForm' class="login_form">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" prefix-icon="el-icon-key" type="password"></el-input>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">确定</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table v-else :data="tableData" height="250" border style="width: 100%">
                    <el-table-column prop="date" label="日期" width="180"></el-table-column>
                    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
                    <el-table-column prop="address" label="地址"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginFormRules: {
                username: [ { required: true, message: '请输入用户名' }],
                password: [ { required: true, message: '请输入密码' } ]
            },
            showCompany: false,
        }
    },
    methods: {
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
        login() {
            this.$refs.loginFormRef.validate(async (value) => {
                const { data: result } = await this.$http.post('/user/login', this.loginForm)
                if (+result.code === 0) {
                    this.$message.success('登录成功')
                    window.sessionStorage.setItem('token', result.data.token)
                    this.$router.push('/home')
                }
                else this.$message.error('登录失败')
            })
            this.$refs.loginFormRef.resetFields()
        }
    },
}
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .login_form {
        position: absolute;
        padding: 0 20px;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>
