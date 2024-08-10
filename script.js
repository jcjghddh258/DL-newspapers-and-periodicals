// 数据结构示例
let groups = []; // 存储所有分组信息

// 创建贴吧分组
function createGroup() {
  let groupName = document.getElementById('groupNameInput').value.trim();
  if (groupName === '') {
    alert('请输入吧名称');
    return;
  }

  let group = {
    name: groupName,
    description: 'Welcome to——' + groupName + '！',
    messages: [] // 存储该分组的消息
  };

  groups.push(group);
  localStorage.setItem('groups', JSON.stringify(groups));
  updateGroupList();
}

// 更新分组列表
function updateGroupList() {
  let groupList = document.getElementById('groupList');
  groupList.innerHTML = '';
  groups.forEach((group, index) => {
    let li = document.createElement('li');
    li.textContent = group.name;

    // 添加删除按钮
    let deleteButton = document.createElement('button');
    deleteButton.textContent = '删除吧';
    deleteButton.onclick = () => deleteGroup(index);

    li.appendChild(deleteButton);

    // 添加点击事件显示分组空间
    li.onclick = () => showGroupSpace(index);
    groupList.appendChild(li);
  });
}

// 删除贴吧分组
function deleteGroup(index) {
  if (confirm(`确定要删除吧 "${groups[index].name}" 吗？`)) {
    groups.splice(index, 1); // 从数组中删除指定索引的分组
    localStorage.setItem('groups', JSON.stringify(groups));
    updateGroupList(); // 更新分组列表
    clearGroupSpace(); // 清空分组空间
  }
}

// 清空分组空间
function clearGroupSpace() {
  let groupSpace = document.getElementById('groupSpace');
  groupSpace.innerHTML = '';
}

// 显示选定分组的空间
function showGroupSpace(index) {
  let group = groups[index];
  let groupSpace = document.getElementById('groupSpace');
  groupSpace.innerHTML = `<h2>${group.name}</h2>
                          <p>${group.description}</p>
                          <hr>`;

  group.messages.forEach(message => {
    if (message.type === 'text') {
      groupSpace.innerHTML += `
        <div class="message">
          <p>${message.content}</p>
          <button onclick="likeMessage(${index}, ${message.id})">赞 (${message.likes})</button>
          <button onclick="deleteMessage(${index}, ${message.id})">删除消息</button>
        </div>
      `;
    } else if (message.type === 'image') {
      groupSpace.innerHTML += `
        <div class="message">
          <img src="${message.content}" alt="图片消息">
          <button onclick="likeMessage(${index}, ${message.id})">赞 (${message.likes})</button>
          <button onclick="deleteMessage(${index}, ${message.id})">删除消息</button>
        </div>
      `;
    } else if (message.type === 'video') {
      groupSpace.innerHTML += `
        <div class="message">
          <video width="320" height="240" controls>
            <source src="${message.content}" type="video/mp4">
            您的浏览器不支持 video 标签。
          </video>
          <button onclick="likeMessage(${index}, ${message.id})">赞 (${message.likes})</button>
          <button onclick="deleteMessage(${index}, ${message.id})">删除消息</button>
        </div>
      `;
    }
  });

  groupSpace.innerHTML += `
    <textarea id="messageInput" placeholder="输入消息"></textarea>
    <br>
   插入附件区:<br>
    <input type="file" id="fileInput">
    <button onclick="sendMessage(${index})">发帖</button>
  `;
}

// 发送消息到分组
function sendMessage(index) {
  let messageInput = document.getElementById('messageInput');
  let fileInput = document.getElementById('fileInput');
  let messageContent = messageInput.value.trim();
  let messageType = 'text';

  if (messageContent === '' && fileInput.files.length === 0) {
    alert('帖子内容不能为空');
    return;
  }

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    if (file.type.startsWith('image/')) {
      reader.onload = function(event) {
        let message = {
          id: groups[index].messages.length + 1,
          type: 'image',
          content: event.target.result,
          likes: 0,
          comments: []
        };

        groups[index].messages.push(message);
        localStorage.setItem('groups', JSON.stringify(groups));
        showGroupSpace(index);
        messageInput.value = '';
        fileInput.value = '';
      };

      reader.readAsDataURL(file);
      return;
    } else if (file.type.startsWith('video/')) {
      reader.onload = function(event) {
        let message = {
          id: groups[index].messages.length + 1,
          type: 'video',
          content: event.target.result,
          likes: 0,
          comments: []
        };

        groups[index].messages.push(message);
        localStorage.setItem('groups', JSON.stringify(groups));
        showGroupSpace(index);
        messageInput.value = '';
        fileInput.value = '';
      };

      reader.readAsDataURL(file);
      return;
    }
  }

  let message = {
    id: groups[index].messages.length + 1,
    type: 'text',
    content: messageContent,
    likes: 0,
    comments: []
  };

  groups[index].messages.push(message);
  localStorage.setItem('groups', JSON.stringify(groups));
  showGroupSpace(index);
  messageInput.value = '';
}

// 点赞消息
function likeMessage(groupIndex, messageId) {
  let message = groups[groupIndex].messages.find(msg => msg.id === messageId);
  if (!message) return;

  if (!message.liked) {
    message.likes++;
    message.liked = true;
  } else {
    message.likes--;
    message.liked = false;
  }

  localStorage.setItem('groups', JSON.stringify(groups));
  showGroupSpace(groupIndex);
}

// 删除消息
function deleteMessage(groupIndex, messageId) {
  let group = groups[groupIndex];
  group.messages = group.messages.filter(message => message.id !== messageId);
  localStorage.setItem('groups', JSON.stringify(groups));
  showGroupSpace(groupIndex);
}

// 初始加载时从localStorage获取数据
window.onload = function() {
  let storedGroups = JSON.parse(localStorage.getItem('groups'));
  if (storedGroups) {
    groups = storedGroups;
    updateGroupList();
  }
};