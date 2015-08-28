var userListData = [];

$(document).ready(function(){
  populateTable();
});

//更新table中的用户数据
function populateTable(){
  var tableContent = '';
  $.getJSON('/users/userlist',function(data){
      userListData = data;
      $.each(data,function(){
          tableContent += '<tr>';
          tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
          tableContent += '<td>' + this.email + '</td>';
          tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
          tableContent += '</tr>';
      });

      $('#userList table tbody').html(tableContent);
  });
};

function showUserInfo(event){
  event.preventDefault();
  var thisUserName = $(this).attr('rel');
  //获取当前点击的用户名的useritem在json数据中的位置
  var arrayPosition = userListData.map(function(arrayItem) {
    return arrayItem.username;
  }).indexOf(thisUserName);
  //根据位置获取到该用户名的其他相关信息
  var thisUserObject = userListData[arrayPosition];
  //将获取到的信息展现在userInfo表中
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
};



// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount === 0) {

        // 获取输入框中输入的数据，作为新的useritem插入到数据库表中
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // 通过post方法像我们的adduser中post数据进数据库
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            if (response.msg === '') {
                // Clear the form inputs
                $('#addUser fieldset input').val('');
                // Update the table
                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {
    event.preventDefault();
    //弹出确认的弹窗
    var confirmation = confirm('Are you sure you want to delete this user?');
    // 如果请求被确认了
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            // Update the table
            populateTable();

        });
    }
    else {
        return false;
    }

};

//添加点击事件，展现详情
 $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
 $('#btnAddUser').on('click',addUser);
 $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
