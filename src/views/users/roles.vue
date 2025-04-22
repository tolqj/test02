<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'

interface RoleData {
  id: number
  name: string
  code: string
  status: number
  description: string
  createTime: string
  updateTime: string
}

// 表格数据
const tableData = ref<RoleData[]>([])
const loading = ref(false)
const total = ref(0)

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 分页参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})

// 弹窗表单
const formData = reactive({
  id: undefined,
  name: '',
  code: '',
  status: 1,
  description: '',
  menuIds: [] as number[]
})

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const isEdit = ref(false)

// 权限树控制
const permDialogVisible = ref(false)
const currentRole = ref<RoleData | null>(null)
const treeData = ref<TreeNodeData[]>([])
const defaultCheckedKeys = ref<number[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '角色编码只能包含大写字母和下划线', trigger: 'blur' }
  ]
})

// 获取表格数据
const getList = () => {
  loading.value = true
  // 这里模拟后端请求
  setTimeout(() => {
    // 模拟数据
    const mockData: RoleData[] = [
      {
        id: 1,
        name: '超级管理员',
        code: 'SUPER_ADMIN',
        status: 1,
        description: '拥有所有权限',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00'
      },
      {
        id: 2,
        name: '普通管理员',
        code: 'ADMIN',
        status: 1,
        description: '拥有部分系统权限',
        createTime: '2023-01-02 00:00:00',
        updateTime: '2023-01-02 00:00:00'
      },
      {
        id: 3,
        name: '用户管理员',
        code: 'USER_MANAGER',
        status: 1,
        description: '负责用户管理',
        createTime: '2023-01-03 00:00:00',
        updateTime: '2023-01-03 00:00:00'
      },
      {
        id: 4,
        name: '内容管理员',
        code: 'CONTENT_MANAGER',
        status: 1,
        description: '负责内容管理',
        createTime: '2023-01-04 00:00:00',
        updateTime: '2023-01-04 00:00:00'
      },
      {
        id: 5,
        name: '访客',
        code: 'VISITOR',
        status: 0,
        description: '只有查看权限',
        createTime: '2023-01-05 00:00:00',
        updateTime: '2023-01-05 00:00:00'
      }
    ]
    
    // 根据搜索条件筛选
    let filteredData = [...mockData]
    if (searchForm.name) {
      filteredData = filteredData.filter(item => 
        item.name.includes(searchForm.name) || 
        item.code.includes(searchForm.name)
      )
    }
    
    if (searchForm.status !== '') {
      filteredData = filteredData.filter(item => 
        item.status === parseInt(searchForm.status)
      )
    }
    
    // 分页
    total.value = filteredData.length
    const start = (queryParams.pageNum - 1) * queryParams.pageSize
    const end = start + queryParams.pageSize
    tableData.value = filteredData.slice(start, end)
    loading.value = false
  }, 500)
}

// 处理搜索
const handleSearch = () => {
  queryParams.pageNum = 1
  getList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = ''
  queryParams.pageNum = 1
  getList()
}

// 打开添加对话框
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '添加角色'
  dialogVisible.value = true
}

// 打开编辑对话框
const handleEdit = (row: RoleData) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑角色'
  // 填充表单数据
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    code: row.code,
    status: row.status,
    description: row.description
  })
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    status: 1,
    description: '',
    menuIds: []
  })
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      // 模拟提交
      setTimeout(() => {
        ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
        dialogVisible.value = false
        getList()
      }, 300)
    }
  })
}

// 删除角色
const handleDelete = (row: RoleData) => {
  ElMessageBox.confirm(
    `确定要删除角色 ${row.name} 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟删除
    setTimeout(() => {
      ElMessage.success('删除成功')
      getList()
    }, 300)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 分页变化
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  getList()
}

// 格式化状态
const formatStatus = (row: RoleData) => {
  return row.status === 1 ? '启用' : '禁用'
}

// 获取权限树数据
const getPermTreeData = () => {
  // 模拟权限树数据
  treeData.value = [
    {
      id: 1,
      label: '系统管理',
      children: [
        { id: 11, label: '用户管理' },
        { id: 12, label: '角色管理' },
        { id: 13, label: '菜单管理' }
      ]
    },
    {
      id: 2,
      label: '内容管理',
      children: [
        { id: 21, label: '文章管理' },
        { id: 22, label: '评论管理' },
        { id: 23, label: '标签管理' }
      ]
    },
    {
      id: 3,
      label: '系统监控',
      children: [
        { id: 31, label: '在线用户' },
        { id: 32, label: '操作日志' },
        { id: 33, label: '系统日志' }
      ]
    }
  ]
}

// 打开权限设置对话框
const handlePermission = (row: RoleData) => {
  currentRole.value = row
  permDialogVisible.value = true
  getPermTreeData()
  
  // 模拟已有权限数据
  // 不同角色有不同的默认权限
  if (row.id === 1) { // 超级管理员
    defaultCheckedKeys.value = [11, 12, 13, 21, 22, 23, 31, 32, 33]
  } else if (row.id === 2) { // 普通管理员
    defaultCheckedKeys.value = [11, 12, 21, 22, 31]
  } else if (row.id === 3) { // 用户管理员
    defaultCheckedKeys.value = [11, 12]
  } else if (row.id === 4) { // 内容管理员
    defaultCheckedKeys.value = [21, 22, 23]
  } else { // 访客
    defaultCheckedKeys.value = []
  }
  
  // 重置选中状态
  setTimeout(() => {
    treeRef.value?.setCheckedKeys(defaultCheckedKeys.value)
  }, 100)
}

// 保存权限设置
const savePermission = () => {
  if (!currentRole.value) return
  
  const checkedKeys = treeRef.value?.getCheckedKeys() || []
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
  const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]
  
  // 模拟保存
  setTimeout(() => {
    ElMessage.success(`已为角色 ${currentRole.value?.name} 设置了 ${allCheckedKeys.length} 个权限`)
    permDialogVisible.value = false
  }, 300)
}

// 生命周期钩子
onMounted(() => {
  getList()
})
</script>

<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.name" placeholder="角色名称/编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 表格区域 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <el-button type="primary" @click="handleAdd">添加角色</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="120"></el-table-column>
        <el-table-column prop="code" label="角色编码" min-width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ formatStatus(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="角色描述" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="success" size="small" @click="handlePermission(scope.row)">权限设置</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入角色编码" :disabled="isEdit"></el-input>
          <div class="form-tips">角色编码只能包含大写字母和下划线</div>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="请输入角色描述"
            rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 权限设置对话框 -->
    <el-dialog
      v-model="permDialogVisible"
      title="权限设置"
      width="600px"
      append-to-body
    >
      <div v-if="currentRole" class="role-info">
        <p><strong>角色名称：</strong>{{ currentRole.name }}</p>
        <p><strong>角色编码：</strong>{{ currentRole.code }}</p>
      </div>
      
      <div class="tree-container">
        <el-tree
          ref="treeRef"
          :data="treeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultCheckedKeys"
        />
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermission">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.form-tips {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.role-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.tree-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
}
</style> 