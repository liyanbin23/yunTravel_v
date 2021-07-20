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
        <!-- <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
          >批量删除</el-button
        > -->
        <el-input
          v-model="query.adminId"
          placeholder="管理员Id"
          class="handle-input mr10"
        ></el-input>
        <el-input
          v-model="query.strategyId"
          placeholder="攻略Id"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
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
          prop="strategyId"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="userId"
          label="用户号"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="titles"
          label="简介"
        ></el-table-column>
        <el-table-column label="图片" align="center">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="$axios.baseURL + scope.row.headImg"
              :preview-src-list="[$axios.baseURL + scope.row.headerImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="人均消费">
          <template #default="scope">￥{{ scope.row.expen }}</template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="travelDays"
          label="旅行期"
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

        <el-table-column
          label="发表时间"
          prop="createTime"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="adminId"
          label="管理员Id"
        ></el-table-column>
        <el-table-column
          label="审核时间"
          prop="auditTime"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >查看</el-button
            >
            <el-button
              v-if="scope.row.status === 1"
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
      //查询字段
      query: {
        adminId: "",
        strategyId: "",
        pageIndex: 1,
        pageSize: 10,
      },
      //城市控件辅助绑定
      cityName: "",
      restaurants: [],
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
    this.getSightsList();
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData() {
      fetchData(this.query).then((res) => {
        console.log(res);
        this.tableData = res.list;
        this.pageTotal = res.pageTotal || 50;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, "pageIndex", 1);
     this.getSightsList();
    },
    // 删除操作
    handleDelete(index) {
      // 二次确认删除
      let mesg = "";
      let status = 0;
      if ((this.tableData[index].status === 0)) {
        mesg = "确定禁用吗？";
        status = 1;
      } else {
        mesg = "确定启用吗？";
      }
      this.$confirm(mesg, "提示", {
        type: "warning",
      })
        .then(() => {
          console.log(this.tableData[index].status);
          this.tableData[index].status =status;
        })
        .catch(() => {});
    },
    //城市控件筛选方法
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.cityName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
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
    // 编辑操作
    handleEdit(index, row) {
      this.$router.push({
        path: "/admin/strategyAuditView",
        query: { strategyId: row.strategyId, tab: "audit" },
      });
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
      this.getData();
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
    getCityList() {
      this.$axios({
        url: "/resources/getCitiesList",
        method: "get",
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.restaurants = res.data.data;
          } else {
            this.$message({
              message: "城市资源获取失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "城市资源获取失败",
            type: "error",
          });
        });
    },
    getSightsList() {
      let strategyId = this.query.strategyId;
      let adminId = this.query.adminId;
      if (strategyId === "") {
        strategyId = 0;
      }
      if (adminId === "") {
        adminId = 0;
      }
      this.$axios({
        url: "/admin/getAuditStrategyList",
        method: "get",
        params: {
          pageSize: this.query.pageSize,
          currentPage: this.query.pageIndex,
          strategyId: strategyId,
          adminId: adminId,
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
