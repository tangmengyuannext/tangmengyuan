<template>
    <div class="app-container">
        <el-row :gutter="10">
            <el-col :span="6">
                <el-input placeholder="输入关键字进行过滤" v-model="filterTextdata"></el-input>
                <el-tree class="filter-tree"
                    :data="treedata"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    ref="tree">
                </el-tree>
            </el-col>
            <el-col :span="18">
                <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
                    <!-- <el-form-item label="发电厂名称" prop="powerName">
                        <el-select v-model="queryParams.powerId" placeholder="请选择发电厂" >
                            <el-option
                            v-for="dict in powerOptions"
                            :key="dict.powerId"
                            :label="dict.powerName"
                            :value="dict.powerId"
                            @keyup.enter.native="handleQuery"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="数据字典名称" prop="name">
                        <el-input v-model="queryParams.name" placeholder="请输入数据字典名称" clearable size="small" 
                        @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['base:line:add']" >新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['base:line:edit']" >修改</el-button>
                    </el-col>
                    <el-col :span="1.5"> 
                        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['base:line:remove']" >删除</el-button>
                    </el-col>
                    <el-col :span="1.5"> 
                        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleImport" v-hasPermi="['base:line:import']" >导入</el-button>
                    </el-col>
                    <el-col :span="1.5"> 
                        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['base:line:export']" >导出</el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="lineList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="KPI分类名称" align="center" prop="name" />
                    <el-table-column label="KPI分类编码" align="center" prop="bianma" />
                    <el-table-column label="对象类别" align="center" prop="duixiang" />
                    <el-table-column label="策略类别" align="center" prop="celue" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width"> 
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" 
                            v-hasPermi="['base:line:edit']">修改</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" 
                            v-hasPermi="['base:line:remove']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" 
                    :limit.sync="queryParams.pageSize" @pagination="getList" />
            </el-col>
        </el-row>

        <!-- 添加或修改数据字典
        对话框-->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <!-- <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="发电厂名称" prop="powerId">
                <el-select v-model="form.powerId" placeholder="请选择发电厂">
                    <el-option
                    v-for="dict in powerOptions"
                    :key="dict.powerId"
                    :label="dict.powerName"
                    :value="dict.powerId"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="数据字典名称" prop="lineName">
                <el-input v-model="form.lineName" placeholder="请输入数据字典名称" />
                </el-form-item>
                <el-form-item label="负责人" prop="leader">
                <el-input v-model="form.leader" placeholder="请输入负责人" />
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
            </el-form> -->
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {  } from "@/api/base/datadictionary";

export default {
  name: "Datadictionary",
    data() {
        return {
            filterTextdata: '',
            treedata: [{
                id: 1,
                label: 'KPI分类',
                children: [{
                    id: 4,
                    label: '升压站',
                    children: [{
                    id: 9,
                    label: '设备'
                    }, {
                    id: 10,
                    label: '车辆'
                    }, {
                    id: 11,
                    label: '人员'
                    }]
                }]
                }, {
                id: 2,
                label: '风机',
                children: [{
                    id: 5,
                    label: '变速箱'
                }, {
                    id: 6,
                    label: '大门'
                }]
                }, {
                id: 3,
                label: '配电室',
                children: [{
                    id: 7,
                    label: '发电机'
                }, {
                    id: 8,
                    label: '齿轮箱'
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 数据字典表格数据
            lineList: [
                {
                    name:"表面",
                    bianma:"1001",
                    duixiang:"风机",
                    celue:"视频识别"
                }
            ],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: undefined,
                // lineName: undefined,
                // status: undefined,
                // leader: undefined,
                // phone: undefined,
                // email: undefined
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            // 发电厂下拉列表
            powerOptions: []
        };
    },
    created() {
        this.getList();
        this.getPowerList();
    },
    methods: {
        filterNode(value, data) { //左侧的树
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        /** 查询数据字典
        列表 */
        getList() {
            // this.loading = true;
            // listLine(this.queryParams).then(response => {
            //     this.lineList = response.rows;
            //     this.total = response.total;
                this.loading = false;
            // });
        },
        // 设备型号下拉列表
        getPowerList() {
            // listPower().then(response => {
            //     this.powerOptions = response.rows;
            // });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                lineId: undefined,
                powerId: undefined,
                lineName: undefined,
                status: "0",
                delFlag: undefined,
                createBy: undefined,
                createTime: undefined,
                updateBy: undefined,
                updateTime: undefined,
                remark: undefined,
                leader: undefined,
                phone: undefined,
                email: undefined
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.lineId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加数据字典";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const lineId = row.lineId || this.ids;
            getLine(lineId).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改数据字典";
            });
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.lineId != undefined) {
                        updateLine(this.form).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        }
                        });
                    } else {
                        addLine(this.form).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        }
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const lineIds = row.lineId || this.ids;
            this.$confirm(
                '是否确认删除数据字典编号为"' + lineIds + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
            .then(function() {
                return delLine(lineIds);
            })
            .then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
            .catch(function() {});
        },
        /** 导入按钮操作 */
        handleImport(){
            
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有数据字典数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(function() {
                return exportLine(queryParams);
            })
            .then(response => {
                this.download(response.msg);
            })
            .catch(function() {});
        }
    },
    watch: {
        filterTextdata(val) {
            this.$refs.tree.filter(val);
        }
    },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table__header{
    width: 100% !important;
}
</style>