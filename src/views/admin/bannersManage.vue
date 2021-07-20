<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 攻略管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-upload"
          class="handle-del mr10"
          @click="addNewBanner"
          >新增</el-button
        >
        <div>
          <el-dialog
            title="新增轮播"
            :visible.sync="dialogVisable"
            width="50%"
            center
          >
            <el-form
              :model="newBannerForm"
              status-icon
              ref="newBannerForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="图片简介" prop="imgDetail">
                <el-input
                  v-model="newBannerForm.imgDetail"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="图片链接"
                prop="pathUrl"
              >
                <el-input
                  v-model="newBannerForm.pathUrl"
                  autocomplete="off"
                  placeholder="若不需要点击图片转链接则不需要填"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="轮播类型"
                prop="banType"
              >
                <el-select v-model="newBannerForm.banType" placeholder="请选择类型">
                  <el-option :key="1" label="首页轮播" :value="1"/> 
                  <el-option :key="2" label="景点页轮播" :value="2"/>
                </el-select>
              </el-form-item>
              <el-form-item label="上传图片" prop="imgUrl">
                <el-upload
                    :action="$axios.baseURL + baseUpUrl"
                    list-type="picture-card"
                    name="files"
                    :limit="1"
                    :on-success="handleSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="imgDialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                  </el-dialog>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')"
                  >提交</el-button
                >
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="imgId"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="pathUrl"
          label="链接"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="imgDetail"
          label="简介"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="banType"
          label="轮播类型"
        ></el-table-column>
        <el-table-column label="图片" align="center">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="$axios.baseURL + scope.row.imgUrl"
              :preview-src-list="[$axios.baseURL + scope.row.imgUrl]"
            ></el-image>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.state === '成功'
                  ? 'success'
                  : scope.row.state === '失败'
                  ? 'danger'
                  : ''
              "
              >{{ scope.row.state }}</el-tag
            >
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="280" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.useAble === 1"
              type="text"
              icon="el-icon-unlock"
              class="drk"
              @click="handleDelete(scope.$index, scope.row)"
              >启用</el-button
            >
            <el-button
              v-else
              type="text"
              icon="el-icon-lock"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >禁用</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="Delete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchData } from "../api/index";
import moment from "moment";
export default {
  name: "basetable",
  data() {
    return {
        query:{
            pageSize:10,
            pageIndex:1,
        },
      newBannerForm: {
        imgId:'',
        imgDetail: "",
        imgUrl: "",
        banType: "",
        pathUrl: "",
        useAble: "",
      },
      dialogVisable: false,
      baseUpUrl: "/filesController/upFiles",
      imgDialogVisible: false,
      dialogImageUrl: "",
      //表格数据
      tableData: [],
      //表格已选择数据
      multipleSelection: [],
      delList: [],
      editVisible: false,
      //总页数
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
    };
  },
  created() {
    // this.getData();
  },
  mounted() {
    //this.getCityList();
    this.getBannersList();
  },
  methods: {
    // 删除操作
    handleDelete(index) {
      // 二次确认删除
      let mesg = "";
      let useAble = 0;
      if (this.tableData[index].useAble === 0) {
        mesg = "确定禁用吗？";
        useAble = 1;
      } else {
        mesg = "确定启用吗？";
      }
      this.$confirm(mesg, "提示", {
        type: "warning",
      })
        .then(() => {
          console.log(this.tableData[index].useAble);
          this.tableData[index].useAble = useAble;
        })
        .catch(() => {});
    },

    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = "";
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    handleEdit(index,row){

    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      this.$set(this.tableData, this.idx, this.form);
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getBannersList();
    },
    handleSelect(item) {
      this.query.cityNum = item.cityId;
      console.log(item);
    },
    //时间格式化
    dateFormat: function (row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },

    submitForm(){
        this.$axios({
        url: "/admin/addBanners",
        method: "put",
        data:this.newBannerForm,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
          this.$message({
              message: "添加成功",
              type: "success",
            });
            this.dialogVisable=false
           this.getBannersList()
          } else {
            this.$message({
              message: "资源获取失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败",
            type: "error",
          });
        });
    },

    getBannersList() {

      this.$axios({
        url: "/admin/getAllBanners",
        method: "get",
        params: {
          pageSize: this.query.pageSize,
          currentPage: this.query.pageIndex,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.tableData = res.data.data.list;
            this.pageTotal = res.data.data.total;
          } else {
            this.$message({
              message: "资源获取失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败",
            type: "error",
          });
        });
    },
    addNewBanner() {
      this.dialogVisable = true;
    },
     //图片移除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //图片放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    //通过成功回调方法获取图片路径
    handleSuccess(res, file) {
      this.newBannerForm.imgUrl = res.data[0];
    },
    Delete(index){
         // 二次确认删除   

      this.$confirm("确定删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
        this.$axios({
        url: "/admin/deleteBanner",
        method: "put",
        data:this.tableData[index],
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
             this.getBannersList()
          } else {
            this.$message({
              message: "资源获取失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败",
            type: "error",
          });
        });
        //   this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.drk {
  color: #72676786;
}
.bule {
  color: #226bda;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
