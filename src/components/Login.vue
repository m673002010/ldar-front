<template>
    <div class="login_container">
        <!-- 登录表单区域 -->
        <div class="login_box">
            <div style="text-align: center">
                <span style="font-size: 30px; font-weight: 1000;">LDAR综合管理系统</span>
            </div>
            <el-form ref="loginFormRef" :rules="loginFormRules" :model='loginForm' class="login_form">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-key" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">确定</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 公司信息 -->
        <el-dialog title="企业列表" :visible.sync="dialogTableVisible" width="70%">
            <el-form ref="queryFormRef" :model="queryForm" :inline="true">
                <el-form-item label="企业编号">
                    <el-input v-model="queryForm.companyNum" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="企业简称">
                    <el-input v-model="queryForm.shortName" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchCompany">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" @row-click="singleElection" highlight-current-row height="350" border>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column label="选择" width="50">
                    <template slot-scope="scope">
                        <el-radio class="radio" v-model="radio" :label="scope.row.companyNum">{{&nbsp;}}</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="companyNum" label="企业编号" width="100"></el-table-column>
                <el-table-column prop="fullName" label="企业全称" width="280"></el-table-column>
                <el-table-column prop="shortName" label="企业简称" width="180"></el-table-column>
                <el-table-column prop="province" label="省" width="180"></el-table-column>
                <el-table-column prop="city" label="市" width="180"></el-table-column>
            </el-table>
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableData.length">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="showDataPanel">确 定</el-button>
            </span>
        </el-dialog>
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
            queryForm: {
                companyNum: '',
                shortName:''
            },
            tableData: [],
            dialogTableVisible: false,
            currentRow: {}, // 当前选择的行
            radio: '', // 控制单选
            currentPage: 1,
            total: 0,
            pageSize: 5
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
                    window.sessionStorage.setItem('token', result.data.token)

                    const { data: companyResult } = await this.$http.get('/company/companyInfo')
                    if (+companyResult.code === 0) {
                        this.tableData = companyResult.data
                        this.dialogTableVisible = true
                    }
                }
                else this.$message.error('登录失败')
            })
        },
        singleElection(row) {
            this.currentRow = row
            this.radio = row.companyNum
        },
        async showDataPanel() {  // window.open('../dataPanel.html', '_parent') // 跳转至数据面板
            if (!this.radio) {
                this.$message.error('请选择公司')
                return
            }

            const { data: result } = await this.$http.post('/user/reToken', { companyNum: this.currentRow.companyNum, shortName: this.currentRow.shortName })
            if (+result.code === 0) {
                window.sessionStorage.setItem('token', result.data.token)
                this.$router.push('/home')
            } else {
                this.$message.error('跳转失败')
            }
        },
        async searchCompany() { // 搜索公司
            const { data: companyResult } = await this.$http.get('/company/companyInfo', { params: this.queryForm })

            if (+companyResult.code === 0) {
                this.tableData = companyResult.data
            }
        },
        handleSizeChange(val){
            this.currentPage = 1
            this.pageSize = val
        },
        handleCurrentChange(val){
            this.currentPage = val
        }
    },
}
</script>

<style lang="less" scoped>
    .login_container {
        // background-color: #3CA993;
        background-image: url(../assets/natural.jpeg);
        background-size: cover;
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
