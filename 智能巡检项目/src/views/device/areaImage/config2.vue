<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="box-card">
                    <div>
                        <el-table
                            :data="cameraList"
                            row-key="cameraId"
                            default-expand-all
                            :tree-props="{
                                children: 'children',
                                hasChildren: 'hasChildren',
                            }"
                        >
                            <el-table-column
                                prop="cameraName"
                                label="终端名称"
                            ></el-table-column>
                            <el-table-column prop="dictLabel" label="图标">
                                <template slot-scope="scope">
                                    <img :src="scope.row.dictLabel" alt="" />
                                </template>
                            </el-table-column>
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
                                        v-hasPermi="['device:area:edit']"
                                        >编辑</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="18">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-card :body-style="{ padding: '0px' }">
                            <img
                                src="./background.jpg"
                                id="id-img-background"
                            />
                            <!-- <div @mousedown="move">
                                {{ positionX }}
                                {{ positionY }}
                                
                            </div> -->
                            <img src="./1.png" alt="" />
                            <img src="./2.png" alt="" />
                            <img src="./3.png" alt="" />
                            <img src="./4.png" alt="" />
                            <img src="./5.png" alt="" />
                            <img src="./6.png" alt="" />
                        </el-card>
                    </el-col>

                    <!-- <el-col :span="24">
                        <el-row :gutter="10" class="mb8">
                            <el-col :span="1.5">
                                <el-button
                                    type="primary"
                                    icon="el-icon-plus"
                                    size="mini"
                                    @click="handleAdd"
                                    v-hasPermi="['device:areaImage:add']"
                                    >保存
                                </el-button>
                            </el-col>
                        </el-row>

                        <el-table v-loading="loading" :data="areaImageList">
                            <el-table-column
                                label="图片名称"
                                align="center"
                                prop="imageName"
                            />
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
                                        icon="el-icon-delete"
                                        @click="handleDelete(scope.row)"
                                        v-hasPermi="['device:areaImage:remove']"
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
                    </el-col> -->
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { listCameraArea } from "@/api/device/camera";

export default {
    name: "AreaImageConfig",
    components: {
        Treeselect,
    },

    data() {
        return {
            // 父页面
            areaImageId: undefined,
            areaId: undefined,

            // 摄像头列表
            cameraList: undefined,

            // 底图
            positionX: "",
            positionY: "",

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                areaId: undefined,
            },
        };
    },

    created() {
        this.areaImageId = this.$route.query.areaImageId;
        this.areaId = this.$route.query.areaId;
        this.queryParams.areaId = this.$route.query.areaId;

        console.log(this.areaId, this.areaImageId);
        this.getTree();
    },

    methods: {
        // 树
        handleDragStart(node, ev) {
            console.log("drag start", node);
        },
        handleDragEnter(draggingNode, dropNode, ev) {
            console.log("tree drag enter: ", dropNode.label);
        },
        handleDragLeave(draggingNode, dropNode, ev) {
            console.log("tree drag leave: ", dropNode.label);
        },
        handleDragOver(draggingNode, dropNode, ev) {
            console.log("tree drag over: ", dropNode.label);
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            console.log("tree drag end: ", dropNode && dropNode.label);
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            console.log("tree drop: ", dropNode.label, dropType);
        },
        allowDrop(draggingNode, dropNode, type) {
            console.log("dropNode: ", dropNode);
        },
        allowDrag(draggingNode) {
            console.log("draggingNode", draggingNode);
        },

        getCameraIcon(name) {
            var imgs = {
                "固定式-枪机": require("../../../assets/camera/icon/固定式-枪机.png"),
                "双目-半球": require("../../../assets/camera/icon/双目-半球.png"),
                "旋转式-半球": require("../../../assets/camera/icon/旋转式-半球.png"),
                "旋转式-球机": require("../../../assets/camera/icon/旋转式-球机.png"),
                "远距离双目-球机": require("../../../assets/camera/icon/远距离双目-球机.png"),
                "轨道机器人": require("../../../assets/camera/icon/轨道机器人.png"),
            }

            return imgs[name]
        },

        getTree() {
            listCameraArea(this.queryParams).then((response) => {
                var res = response.rows
                res.forEach(e => {
                    e.dictLabel = this.getCameraIcon(e.dictLabel)
                });
                this.cameraList = this.handleTree(res);
            });
        },

        move(e) {
            let odiv = e.target; //获取目标元素

            //算出鼠标相对元素的位置
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            document.onmousemove = (e) => {
                //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let left = e.clientX - disX;
                let top = e.clientY - disY;

                //绑定元素位置到positionX和positionY上面
                this.positionX = top;
                this.positionY = left;

                //移动当前元素
                odiv.style.left = left + "px";
                odiv.style.top = top + "px";
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
    },
};
</script>
<style lang="scss" scoped>
#id-img-background {
    width: 100%;
}
</style>