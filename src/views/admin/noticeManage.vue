<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 管理员管理
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
          prop="noticeId"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="noticePath"
          label="链接"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="noticeTitle"
          label="标题"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="noticeCont"
          label="内容"
        ></el-table-column>
        <el-table-column
          label="发表时间"
          prop="createTime"
          :formatter="dateFormat"
        ></el-table-column>
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
              >解禁</el-button
            >
            <el-button
              v-else
              type="text"
              icon="el-icon-lock"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >禁用</el-button
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
import E from "wangeditor";
import moment from "moment";
export default {
  name: "basetable",
  data() {
    var validapassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.newBannerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      editor: null,
      query: {
        pageSize: 10,
        pageIndex: 1,
      },
      newBannerForm: {
        noticeId: "",
        noticePath: "",
        noticeTitle: "",
        noticeCont: "",
        createTime: "",
        status: "",
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
    this.getNoticeList();
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
    handleEdit(index, row) {},
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      this.$set(this.tableData, this.idx, this.form);
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getNoticeList();
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
    submitForm() {
      this.newBannerForm.noticeCont = editor.text.html();
      this.$axios({
        url: "/admin/addNotice",
        method: "put",
        data: this.newBannerForm,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.dialogVisable = false;
            this.getAdminList();
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

    getNoticeList() {
      this.$axios({
        url: "/admin/getNoticeList",
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
      this.$router.push({path:"/admin/noticeEditor",query:{tab:"notic"}})
    },
    //图片移除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //图片放大
    handlePictureCardPreview(file) {
      console.log(file.url);
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    //通过成功回调方法获取图片路径
    handleSuccess(res, file) {
      this.newBannerForm.usImage = res.data[0];
    },
    Delete(index) {
      // 二次确认删除

      this.$confirm("确定删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: "/admin/deleteBanner",
            method: "put",
            data: this.tableData[index],
          })
            .then((res) => {
              console.log(res);
              if (res.data.code === 0) {
                this.getBannersList();
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
.editor {
  width: 100%;
  margin: 50px auto auto auto;
}
</style>
