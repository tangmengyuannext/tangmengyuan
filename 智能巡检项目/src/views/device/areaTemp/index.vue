<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            label-width="100px"
        >
            <el-form-item label="测温点名称" prop="areaTempName">
                <el-input
                    v-model="queryParams.areaTempName"
                    placeholder="请输入测温点名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="所属区域" prop="areaId">
                <treeselect
                    v-model="queryParams.areaId"
                    :options="areaOptions"
                    :normalizer="normalizer"
                    placeholder="请选择所属区域"
                />
            </el-form-item>
            <el-form-item label="智能感知终端" prop="cameraId">
                <el-select
                    v-model="queryParams.cameraId"
                    clearable
                    placeholder="请输入智能感知终端"
                    @change="changeCameraQuery()"
                >
                    <el-option
                        v-for="dict in cameraOptions"
                        :key="dict.cameraId"
                        :label="dict.cameraName"
                        :value="dict.cameraId"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否在面板中" prop="isShow" >
                <el-select v-model="queryParams.isShow">
                    <el-option
                    v-for="dict in isYesOrNoOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                >
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['device:areaTemp:add']"
                    >新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['device:areaTemp:edit']"
                    >修改
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['device:areaTemp:remove']"
                    >删除
                </el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                <el-button
                    type="warning"
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['device:areaTemp:export']"
                    >导出
                </el-button>
            </el-col> -->
        </el-row>

        <el-table
            v-loading="loading"
            :data="areaTempList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <!-- <el-table-column label="ID" align="center" prop="id" /> -->
            <el-table-column
                label="测温点名称"
                align="center"
                prop="areaTempName"
            />
            <el-table-column label="所属区域" align="center" prop="areaName" />
            <el-table-column
                label="智能感知终端"
                align="center"
                prop="cameraName"
            />

            <el-table-column
                label="关联硬件ID"
                align="center"
                prop="areaTempId"
            />
            <el-table-column label="是否在面板中" align="center" prop="isShow" :formatter="isYesOrNoFormat"/>


            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['device:areaTemp:edit']"
                        >修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['device:areaTemp:remove']"
                        >删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改区域温度对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            width="500px"
            append-to-body
        >
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-form-item label="所属区域" prop="areaId">
                    <treeselect
                        v-model="form.areaId"
                        :options="areaOptions"
                        :normalizer="normalizer"
                        placeholder="请选择所属区域"
                    />
                </el-form-item>
                <el-form-item label="测温点名称" prop="areaTempName">
                    <el-input
                        v-model="form.areaTempName"
                        placeholder="请输入测温点名称"
                    >
                        <!-- <template slot="prepend">{{form.areaName}}-</template> -->
                    </el-input>
                </el-form-item>
                <el-form-item label="智能感知终端" prop="cameraId">
                    <el-select
                        v-model="form.cameraId"
                        clearable
                        placeholder="请输入智能感知终端"
                        @change="changeCamera()"
                    >
                        <el-option
                            v-for="dict in cameraOptions"
                            :key="dict.cameraId"
                            :label="dict.cameraName"
                            :value="dict.cameraId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否在面板中" prop="isShow">
                    <el-radio-group v-model="form.isShow">
                        <el-radio
                        v-for="dict in isYesOrNoOptions"
                        :key="dict.dictValue"
                        :label="dict.dictValue"
                        >{{dict.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="关联硬件ID" prop="areaTempId">
                    <el-input
                        v-model="form.areaTempId"
                        placeholder="请输入关联硬件ID"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listAreaTemp,
    getAreaTemp,
    delAreaTemp,
    addAreaTemp,
    updateAreaTemp,
    exportAreaTemp,
} from "@/api/device/areaTemp";
import { listArea, getArea } from "@/api/device/area";
import { listCamera, getCamera } from "@/api/device/camera";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "AreaTemp",
    components: { Treeselect },
    data() {
        return {
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
            // 区域温度表格数据
            areaTempList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                areaId: undefined,
                cameraId: undefined,
                areaTempId: undefined,
                areaTempName: undefined,
                isShow: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                areaTempName: [
                    {
                        required: true,
                        message: "请输入检测点",
                        trigger: "blur",
                    },
                    {
                        max: 15,
                        message: '检测点名称不超过15个字符',
                        trigger: 'blur',
                    },
                    // {
                    //     trigger: 'blur',
                    //     validator: (rule, value, callback) => {
                    //         中文验证
                    //         var reg = /[^\u4e00-\u9fa5]/;

                    //         if (!reg.test(value)) {
                    //             callback(new Error("账号不能为中文"))
                    //         }
                    //     },
                    // },
                ],
                areaId: [
                    {
                        required: true,
                        message: "请选择区域",
                        trigger: "change",
                    },
                ],
                cameraId: [
                    {
                        required: true,
                        message: "请选择终端",
                        trigger: "change",
                    },
                ],
                areaTempId: [
                    {
                        required: true,
                        message: "请输入关联硬件ID",
                        trigger: "blur",
                    },
                ],
            },
            // 区域树
            areaOptions: [],
            // 摄像头树
            cameraOptions: [],
            // 查询参数
            queryParamsOfCamera: {
                pageNum: 1,
                pageSize: 9999,
                areaId: undefined,
                hasInfrared: "1",
                isShow: "0",
            },
            isYesOrNoOptions:[],
        };
    },
    created() {
        this.getDicts("dev_yes_no").then(response => {
            this.isYesOrNoOptions = response.data;
        });
        this.getList();
        this.getTreeselect();
        this.getCameraList();
    },
    watch: {
        "form.areaId": "changeArea",
        "queryParams.areaId": "changeAreaQuery",
    },
    methods: {
        // 参数系统内置字典翻译
        isYesOrNoFormat(row, column) {
            return this.selectDictLabel(this.isYesOrNoOptions, row[column.property]);
        },
        /** 转换区域数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.areaId,
                label: node.areaName,
                children: node.children,
            };
        },
        /** 查询区域下拉树结构 */
        getTreeselect() {
            listArea().then((response) => {
                this.areaOptions = this.handleTree(response.data, "areaId");
            });
        },
        /** 查询区域温度列表 */
        getCameraList() {
            listCamera(this.queryParamsOfCamera).then((response) => {
                this.cameraOptions = response.rows;
            });
        },
        // 区域下拉树改变
        changeArea() {
            this.queryParamsOfCamera.areaId = this.form.areaId;
            if(this.form.areaId != undefined) {
                getArea(this.form.areaId).then(res => {
                    this.form.areaName = res.data.areaName
                })
            }
            listCamera(this.queryParamsOfCamera).then((response) => {
                this.cameraOptions = response.rows;
            });
        },
        // 区域下拉树改变
        changeAreaQuery() {
            this.queryParamsOfCamera.areaId = this.queryParams.areaId;
            listCamera(this.queryParamsOfCamera).then((response) => {
                this.cameraOptions = response.rows;
            });
        },
        // 设备下拉树改变
        changeCamera() {
            if (this.form.cameraId) {
                getCamera(this.form.cameraId).then((response) => {
                    this.form.areaId = response.data.areaId;
                });
            }
        },
        // 设备下拉树改变
        changeCameraQuery() {
            if (this.queryParams.cameraId) {
                getCamera(this.queryParams.cameraId).then((response) => {
                    this.queryParams.areaId = response.data.areaId;
                });
            }
        },
        /** 查询区域温度列表 */
        getList() {
            this.loading = true;
            listAreaTemp(this.queryParams).then((response) => {
                this.areaTempList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                areaId: undefined,
                areaName: undefined,
                cameraId: undefined,
                cameraName: undefined,
                areaTempId: undefined,
                areaTempName: undefined,
                isShow: "0",
                status: "0",
                delFlag: undefined,
                createBy: undefined,
                createTime: undefined,
                updateBy: undefined,
                updateTime: undefined,
                remark: undefined,
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
            this.ids = selection.map((item) => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getTreeselect();
            this.open = true;
            this.title = "添加区域温度";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            const id = row.id || this.ids;
            getAreaTemp(id).then((response) => {
                this.form = response.data;
                let s = this.form.areaTempName
                // this.form.areaTempName = this.form.areaTempName.substring(s.indexOf("-"))
                this.open = true;
                this.title = "修改区域温度";
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != undefined) {
                        // this.form.areaTempName = this.form.areaName + '-' + this.form.areaTempName
                        updateAreaTemp(this.form).then((response) => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            }
                        });
                    } else {
                        // this.form.areaTempName = this.form.areaName + '-' + this.form.areaTempName
                        addAreaTemp(this.form).then((response) => {
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
            const ids = row.id || this.ids;
            this.$confirm(
                '是否确认删除区域温度编号为"' + ids + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return delAreaTemp(ids);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch(function () {});
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有区域温度数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return exportAreaTemp(queryParams);
                })
                .then((response) => {
                    this.download(response.msg);
                })
                .catch(function () {});
        },
    },
};
</script>
<style lang="scss">
.vue-treeselect__control {
    display: table-cell;
}
</style>