<template>
    <div class="app-container">
        <el-table :data="tableData" @cell-click="cellClick">
            <el-table-column label="数据源" align="center" prop="shujuyuan" />
            <el-table-column label="保留时间" align="center" prop="savetime" >
                <!-- <template slot-scope="scope">
                  <el-input placeholder="请输入保留时间" v-model="scope.row.powerName"></el-input>
                </template> -->
                <template slot-scope="scope">
                    <el-input v-model="scope.row.savetime" v-if="scope.row.isedit" @blur="loseFcous(scope.$index, scope.row)" > </el-input>
                    <span style="margin-left: 10px" v-else>{{ scope.row.savetime }}</span>
                </template>
            </el-table-column>
             <el-table-column label="导入数据">
                <template slot-scope="scope">
                    <el-button @click="handletheimport(scope.row)" type="text" size="small">导入</el-button>
                </template>
            </el-table-column>
            <el-table-column label="导出数据">
                <template slot-scope="scope">
                    <el-button @click="handleexport(scope.row)" type="text" size="small">导出</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="handledelect(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {  } from "@/api/base/datamanagement";

export default {
  name: "Datamanagement",
    data() {
        return {
            tableData: [  //表格内修改 == device/equipmentBase/config
                {
                    shujuyuan: '王小虎',
                    savetime:"30",
                    isedit:false,
                }, {
                    shujuyuan: '王小虎',
                    savetime:"30",
                    isedit:false,
                }, {
                    shujuyuan: '王小虎',
                    savetime:"30",
                    isedit:false,
                }, {
                    shujuyuan: '王小虎',
                    savetime:"30",
                    isedit:false,
                },
            ]
        };
    },
    created() {
        
        
    },
    methods: {
        loseFcous(index, row) {
            row.isedit=false;
        },
        cellClick(row, column) {
            row.isedit=true;
        },
        handletheimport(row) {
            console.log(row);
        },
        handleexport(row){
            console.log(row);
        },
        handledelect(row){
            console.log(row);
        }
    },
    watch: {
       
    },
};
</script>