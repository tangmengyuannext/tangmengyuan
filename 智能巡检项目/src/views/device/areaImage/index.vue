<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['device:areaImage:add']"
                    >新增
                </el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="areaImageList">
            <el-table-column label="图片名称" align="center" prop="imageName" />
            <el-table-column
                label="所属区域/设备"
                align="center"
                prop="areaName"
            />
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
                        v-hasPermi="['device:areaImage:edit']"
                        >编辑
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['device:areaImage:remove']"
                        >删除
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleConfig(scope.row)"
                        v-hasPermi="['device:areaImage:config']"
                        >标记
                    </el-button>
                    <!-- <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleView(scope.row)"
                        v-hasPermi="['device:areaImage:view']"
                        >预览
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-download"
                        @click="handleExport(scope.row)"
                        v-hasPermi="['device:areaImage:export']"
                        >导出
                    </el-button> -->
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

        <!-- 添加或修改图片标记对话框 -->
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
                <el-form-item label="底图名称" prop="imageName">
                    <el-input
                        v-model="form.imageName"
                        placeholder="请输入图片名称"
                    />
                </el-form-item>
                <el-form-item label="关联区域/设备" prop="areaId">
                    <treeselect
                        v-model="form.areaId"
                        :options="areaOptions"
                        :disabled="title == '新增底图' ? false : true"
                        :normalizer="normalizer"
                        placeholder="请选择区域"
                    />
                </el-form-item>
                <el-form-item label="关联底图路径" prop="originalImageUrl">
                    <el-select v-model="form.originalImageUrl" placeholder="请输入底图路径">
                        <el-option
                            v-for="dict in imageNameOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                        ></el-option>
                    </el-select>
                    <!-- <el-input
                        v-model="form.originalImageUrl"
                        placeholder="请输入底图路径"
                    /> -->
                </el-form-item>
                
                <el-form-item label="关联底图" v-if="showImage">
                    <el-image
                        style="width: 300px; height: 200px"
                        fit="fill"
                        :preview-src-list="srcList"
                        :src="imageUrl"
                    ></el-image>
                </el-form-item>
                <!-- <el-form-item label="上传图片">
                    <el-upload
                        ref="upload"
                        class="upload-demo"
                        accept="image/*"
                        list-type="picture"
                        :headers="upload.headers"
                        :action="
                            upload.url +
                            '?updateSupport=' +
                            upload.updateSupport
                        "
                        :disabled="upload.isUploading"
                        :limit="1"
                        :file-list="fileList"
                        :on-preview="handlePreview"
                        :on-success="handleSuccess"
                        :on-progress="handleProgress"
                        :on-remove="handleRemove"
                    >
                        <el-button size="small" type="primary">{{
                            upload.btnText
                        }}</el-button>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" append-to-body>
                        <img width="100%" :src="dialogImageUrl" alt="" />
                    </el-dialog>
                </el-form-item> -->
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
    listAreaImage,
    getAreaImage,
    delAreaImage,
    addAreaImage,
    updateAreaImage,
    exportAreaImage,
    getAllImageName,
} from "@/api/device/areaImage";
import { listArea } from "@/api/device/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";

export default {
    name: "AreaImage",
    components: {
        Treeselect,
    },
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
            // 图片标记表格数据
            areaImageList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                imageName: undefined,
                areaId: undefined,
                areaParentId: undefined,
                originalImageUrl: undefined,
                markedImageUrl: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                imageName: [
                    {
                        required: true,
                        message: "图片名称不能为空",
                        trigger: "blur",
                    },
                ],
                areaId: [
                    {
                        required: true,
                        message: "区域ID不能为空",
                        trigger: "blur",
                    },
                ],
                areaParentId: [
                    {
                        required: true,
                        message: "区域父ID不能为空",
                        trigger: "blur",
                    },
                ],
                originalImageUrl: [
                    {
                        required: true,
                        message: "区域/设备原底图地址不能为空",
                        trigger: "blur",
                    },
                ],
            },
            // 区域树选项
            areaOptions: [],
            // 图片上传
            showImage: false,
            dialogImageUrl: "",
            dialogVisible: false,
            fileList: [],
            imageUrl: "",
            srcList: [],
            upload: {
                btnText: "上传图片",
                // fileList: [],
                // dialogImageUrl: "",
                // dialogVisible: false,
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/device/areaImage/upload",
            },
            imageNameOptions: [],
        };
    },
    created() {
        this.getList();
        this.getTreeselect();
        this.getAllImage() 
    },
    methods: {
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

        getAllImage() {
            getAllImageName().then((response) => {
                var res = response.data
                res = res.map(o => {
                    return {
                        'dictLabel': o,
                        'dictValue': '/profile/image/' + o,
                    }
                })
                this.imageNameOptions = res;
            });
        },

        /** 查询区域下拉树结构 */
        getTreeselect() {
            listArea().then((response) => {
                this.areaOptions = this.handleTree(response.data, "areaId");
            });
        },

        /** 上传图片 */
        handlePreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        handleSuccess(response, file, fileList) {
            this.upload.isUploading = false;
            var res = response.data;
            if (res != null) {
                this.form.originalImageUrl = res.originalImageUrl;
                this.upload.dialogVisible = false;
                this.upload.isUploading = false;
                this.msgSuccess("上传成功");
            } else {
                this.upload.dialogVisible = false;
                this.upload.isUploading = false;
                this.msgError("上传失败");
            }
        },
        // 删除图片
        handleRemove(file) {
            console.log(file);
        },

        /** 查询图片标记列表 */
        getList() {
            this.loading = true;
            listAreaImage(this.queryParams).then((response) => {
                this.areaImageList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },

        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
            this.$refs.upload.clearFiles();
        },
        // 表单重置
        reset() {
            this.form = {
                areaImageId: undefined,
                imageId: undefined,
                imageName: undefined,
                areaId: undefined,
                areaName: undefined,
                areaParentId: undefined,
                originalImageUrl: undefined,
                markedImageUrl: undefined,
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
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.getTreeselect();
            this.showImage = false;
            this.upload.btnText = "上传图片";
            this.open = true;
            this.title = "新增底图";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.getTreeselect();
            const imageId = row.imageId || this.ids;
            getAreaImage(imageId).then((response) => {
                this.form = response.data;
                this.imageUrl =
                    process.env.VUE_APP_BASE_API +
                    response.data.originalImageUrl;
                this.srcList = [];
                this.srcList.push(this.imageUrl);
                this.upload.btnText = "重新上传";
                this.showImage = true;
                this.open = true;
                this.title = "修改图片标记";
            });
        },
        handleConfig(row) {
            console.log("row", row)
            this.$router.push({
                path: "/device/areaImage/config",
                query: { areaImageId: row.imageId, areaId: row.areaId },
            });
        },

        /** 提交按钮 */
        submitForm: function () {
            // this.$refs.upload.clearFiles();
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.imageId != undefined) {
                        updateAreaImage(this.form).then((response) => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            }
                        });
                    } else {
                        addAreaImage(this.form).then((response) => {
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
            const imageIds = row.imageId || this.ids;
            this.$confirm(
                '是否确认删除图片名称为"' + row.imageName + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return delAreaImage(imageIds);
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
            this.$confirm("是否确认导出所有图片标记数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return exportAreaImage(queryParams);
                })
                .then((response) => {
                    this.download(response.msg);
                })
                .catch(function () {});
        },
    },
};
</script>
