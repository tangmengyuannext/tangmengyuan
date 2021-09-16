<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="18">
                <el-card body-style="{ padding: '0px' }">
                    <div class="attention-text">*先点击要改变位置的智能终端，再拖拽智能终端改变位置</div>
                    <div :style="imgDiv">
                        <img :src="imgSrc" id="imgBg" ref="shengyazhanImg"/>
                        <span v-for="c in cameraIconList" :key="c.cameraId">
                            <el-tooltip class="item" effect="dark" :content="c.cameraName" placement="bottom">
                                <img :id="c.imgId" :src="c.src" :style="c.style" @mousedown="drag" />
                            </el-tooltip>
                        </span>
                    </div>
                </el-card>
                
            </el-col>
            <el-col :span="6">
                <el-card>
                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="addCamera"
                                >添加终端
                            </el-button>
                            <el-button
                                type="primary"
                                icon="el-icon-check"
                                size="mini"
                                @click="submitForm"
                                >保存
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-table v-loading="loading" :data="cameraList" :row-style="rowClass">
                        <el-table-column label="终端ID" align="center" prop="cameraId" />
                        <el-table-column label="终端名称" align="center" prop="cameraName" />
                        <el-table-column label="x" align="center" prop="left" />
                        <el-table-column label="y" align="center" prop="top" />
                        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="text"
                                    icon="el-icon-delete"
                                    @click="handleDelete(scope.row)"
                                    >
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                
            </el-col>
        </el-row>

        <el-dialog
            :title="title"
            :visible.sync="open"
            width="1000px"
            append-to-body
        >
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
                <el-form-item label="终端名称" prop="cameraName">
                    <el-input
                    v-model="queryParams.cameraName"
                    placeholder="请输入智能感知终端名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="所属区域" prop="areaId">
                    <treeselect v-model="queryParams.areaId" :options="areaOptions" :normalizer="normalizer" placeholder="请选择所属区域" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">确认添加</el-button>
                </el-form-item>
            </el-form>

            <el-table v-loading="loading1" :data="notConfigureCameraList" height="300" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" width="100"/>
                <el-table-column label="ID" align="center" width="100" prop="cameraId"/>
                <el-table-column label="终端名称" align="center" prop="cameraName"/>
                <el-table-column label="所属区域" align="center" prop="area.areaName"/>
            </el-table>
            
            <!-- <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="addCamera"
            /> -->
        </el-dialog>
            
    </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { getAreaInfo } from "@/api/device/areaImage";
import { delLocation, saveLocationList} from "@/api/device/location";
import { listCamera } from "@/api/device/camera";
import { listArea } from "@/api/device/area";




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

            loading: false,
            imgDiv: {
                position: 'relative',
            },

            // 底图
            imgSrc: '',
            imgWidth: 0, // 底图宽
            imgHeight: 0, // 底图高
            offsetLeft: 0, // 图标距离左边距离
            offsetTop: 0, // 图标距离顶边距离
            
            isDrag: false,
            
            // 接口
            imageInfo: {},
            // 摄像头页面列表
            cameraList: [],
            // 摄像头图标列表
            cameraIconList: [],
            // 摄像头保存坐标列表
            locationList: [],
            

            
            // 查询的摄像头
            addCameraList: [],
            // 添加的摄像头列表
            addCameras: [],
            // 未指定位置摄像头
            notConfigureCameraList: [],
            // 选中数组
            ids: [],
            // 遮罩层
            loading1: false,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 总条数
            total: 0,
            // 区域树选项
            areaOptions: [],
            // 查询参数
            queryParams: {
                // pageNum: 1,
                // pageSize: 10,
                areaId: undefined,
                cameraName: undefined,
            },

            // 保存选中摄像头id，高亮表格样式用
            choosedId: '',
            isRealDelete: false // 判断是否删除的是为保存摄像头
        };
    },

    created() {
        this.areaImageId = this.$route.query.areaImageId;
        this.areaId = this.$route.query.areaId;
        this.getList();
    },

    methods: {
        getCameraIcon(name) {
            var imgs = {
                "固定式-枪机": require("../../../assets/image/固定式-枪机.png"),
                "双目-半球": require("../../../assets/image/双目-半球.png"),
                "旋转式-半球": require("../../../assets/image/旋转式-半球.png"),
                "旋转式-球机": require("../../../assets/image/旋转式-球机.png"),
                "远距离双目-球机": require("../../../assets/image/远距离双目-球机.png"),
                "轨道机器人": require("../../../assets/image/轨道机器人.png"),
            }

            return imgs[name]
        },

        /** 转换区域数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.areaId,
                label: node.areaName,
                children: node.children
            };
        },

        /** 查询区域下拉树结构 */
        getTreeselect() {
            listArea().then(response => {
                this.areaOptions = this.handleTree(response.data, "areaId");
            });
        },

        reset() {
            this.cameraList = []
            this.cameraIconList = []
            this.locationList = []
        },
        // 查询底图摄像头列表
        getList() {
            this.reset()
            this.loading = true
            getAreaInfo(this.areaId).then((response) => {
                let res = response.data
                this.imageInfo = response.data
                this.imgSrc = process.env.VUE_APP_BASE_API + res.area.originalImageUrl
                this.cameraList = res.cameras.map(t => {
                    return {
                        'locationId': t.locationId,
                        'cameraId': t.cameraId,
                        'cameraName': t.cameraName,
                        'left': (t.styleLeft * 100).toFixed(2),
                        'top': (t.styleTop * 100).toFixed(2),
                        'icon': t.camera.dictLabel,
                    }
                })
                this.cameraToIcon()
                console.log("cameraIcon", this.cameraIconList)
                this.loading = false
            });
        },

        cameraToIcon() {
            this.cameraIconList = this.cameraList.map(t => {
                return {
                    'imgId': t.cameraId + "-addIcon",
                    'cameraId': t.cameraId,
                    'cameraName': t.cameraName,
                    'src': this.getCameraIcon(t.icon),
                    'style': {position: 'absolute', left: t.left + '%', top: t.top + '%', width: '20px', height: '20px', 'z-index': 99},
                }
            })
        }, 

        cameraToLocation() {
            this.locationList = this.cameraList.map(t => {
                return {
                    'imageId': this.areaImageId,
                    'areaId': this.areaId,
                    'cameraId': t.cameraId,
                    'styleLeft': (Number(t.left / 100)),
                    'styleTop': (Number(t.top / 100)),
                }
            })
        },

        updataCameraList(id, left, top) {
            this.cameraList.find(t => {
                if(t.cameraId == id) {
                    t.left = left
                    t.top = top
                }
            });
        },
        // 新增摄像头时查询所有摄像头
        addCamera() {
            this.getTreeselect()
            this.loading1 = true;
            this.notConfigureCameraList = [];
            listCamera(this.queryParams).then(response => {
                this.addCameraList = response.rows;
                // 定义长度为了减少每次循环做一次长度计算
                const addLength = this.addCameraList.length // 全部摄像头数组长度
                const cLength = this.cameraList.length // 已经绑定的摄像头长度
                let count
                for (let m = 0; m < addLength; m++) {
                    count = 0
                    for (let n = 0; n < cLength; n++) {
                        if (this.addCameraList[m].cameraId == this.cameraList[n].cameraId) {
                            count = 1
                            break
                        }
                    }
                    if (count === 0) {
                        this.notConfigureCameraList.push(this.addCameraList[m])
                    }
                }
                // this.total = response.total;
                this.total = this.notConfigureCameraList.length
                this.loading1 = false;
                this.open = true;
                this.title = "添加智能感知终端";
            });

            
        },
        // 保存
        submitForm() {
            this.cameraToLocation()
            saveLocationList(this.locationList).then(response => {
                this.loading = true
                if (response.code === 200) {
                    this.loading = false
                    this.msgSuccess("保存成功");
                    this.getList();
                }
            })
        },

        // 拖拽
        drag() {
            let obox = document.getElementById("imgBg");
            this.imgWidth = obox.clientWidth;
            this.imgHeight = obox.clientHeight;

            let box = event.target

            let disX
            let disY
            const that = this;
            that.choosedId = box.id.substring(0, box.id.indexOf('-')) // 高亮表格对应数据
            // 鼠标左键按下事件
            box.onmousedown=function(ev){
                that.isChooseLocationVisible = true;
                let oEvent = ev;
                // clientX，clientY：鼠标点击位置到浏览器可视区域x，y距离
                // offsetLeft，offsetTop:元素距离父级元素的偏移距离
                disX = oEvent.clientX - box.offsetLeft;
                disY = oEvent.clientY - box.offsetTop;
                // that.isDrag = true;
                // 鼠标移动事件
                document.onmousemove = function(ev){
                    // 加入该判断拖拽更流畅
                    // if (that.isDrag) {
                        let oEvent = ev
                        // 计算点击元素到父级元素的定位top，left距离
                        let l=oEvent.clientX-disX
                        let t=oEvent.clientY-disY
                        /** 限定拖拽范围，限定拖拽元素在指定的范围内 */
                        // 限定左边界和上边界
                        if(l < 0){
                            l = 0;
                        }
                        if(t < 0){
                            t = 0;
                        }
                        // 限定右边界的距离(当l=父元素宽-子元素宽时，刚好子元素放在父元素最右边)
                        if(l > obox.clientWidth - box.clientWidth){
                            l = obox.clientWidth - box.clientWidth;
                        }
                        // 限定下边界的距离(当t=父元素高-子元素高时，刚好子元素放在父元素最下边)
                        if(t>obox.clientHeight - box.clientHeight){
                            t = obox.clientHeight - box.clientHeight;
                        }
                        box.style.left = l + 'px';
                        box.style.top = t + 'px';
                    // }
                }
                document.onmouseup=function(){
                    // 存入坐标百分比
                    that.offsetLeft = ((box.offsetLeft / that.imgWidth) * 100).toFixed(1);
                    that.offsetTop = ((box.offsetTop / that.imgHeight) * 100).toFixed(1);
                    // that.isDrag = false;
                    document.onmousemove = null;
                    document.onmouseup = null; //鼠标抬起来后，onmouseup事件本身也没意义了，所以最好清理掉
                    let id = box.id.substring(0, box.id.indexOf('-'))
                    console.log(id, that.offsetLeft, that.offsetTop)
                    that.updataCameraList(id, that.offsetLeft, that.offsetTop)
                }
                return false //阻止默认行为，空的div在低版本ff下，第二次拖动手型会变异常
            }
        },

        /** 删除按钮操作 */
        handleDelete(row) {
            let locationId = row.locationId;
            console.log(locationId)
            const that = this
            this.$confirm(
                '是否确认删除该摄像头标记的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    if(locationId) {
                        that.isRealDelete = true
                        return delLocation(locationId)
                    } else {
                        console.log("del ", row)
                        console.log(that.cameraList.length)
                        that.isRealDelete = false
                        for(let i = 0; i < that.cameraList.length; i += 1) {
                            if(row.cameraId == that.cameraList[i].cameraId) {
                                that.cameraList.splice(i, 1)
                            }
                        }
                        console.log(that.cameraList)
                        return that.cameraToIcon()
                    }
                })
                .then(() => {
                    if (that.isRealDelete) {
                        that.getList()
                    }
                    that.msgSuccess("删除成功");
                })
                .catch(function () {});
        },
        
        /** 搜索按钮操作 */
        handleQuery() {
            this.$refs["queryForm"].validate((valid) => {
                if (valid) {
                    // this.queryParams.pageNum = 1;
                    this.addCamera();
                } else {
                    return false;
                }
            })
        },
        
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },

        handleSelectionChange(selection) {
            console.log(selection)
            let x = 0
            let y = 0
            this.addCameras = selection.map(t => {
                t = {
                    'cameraId': t.cameraId,
                    'cameraName': t.cameraName,
                    'left': x,
                    'top': y,
                    'icon': t.dictLabel,
                }
                x += 2
                return t
            })
            console.log(this.addCameras)

            this.ids = selection.map(item => item.cameraId)
            this.single = selection.length != 1
            this.multiple = !selection.length
        },
        // 添加摄像头
        handleAdd() {
            this.cameraList = this.cameraList.concat(this.addCameras);
            this.cameraToIcon()
            this.open = false
        },
        // 选中摄像头或鼠标悬停摄像头时，高亮表格对应的一行
        rowClass({row, rowIndex}) {
            if (this.choosedId == row.cameraId) {
                return {'background-color': 'rgba(185, 221, 249, 0.75)'}
            }
        }

    },
};
</script>
<style lang="scss">
#imgBg {
    width: 100%;
}

.vue-treeselect__control {
    display: table-cell;
}

.attention-text {
    color: red;
    font-size: 12px;
}
</style>