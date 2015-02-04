// province 没有动
// school 没有动 需要传递后删除official 
// room  1. classNumber->flag 2. 合并students teachers 3.删除newstudents
// user 
1. name -> profile.name 
2. username -> privacy.username  
3. email -> privacy.useremail phone->privacy.userphone
4. gender -> profile.gender
5. 删除provider
6. 删除usergroup
7. roles->role roles变成对象
8. have_profile is_temp ->tempAttribute.haveProfile tempAttribute.isTemp
9. 删除beingwatched
10. rooms重新构造
11. 删除remark
12. 删除apps
13. 删除active
14. registDate -> usefulData.registDate
15. grade
16. 删除survey1
17. 删除loginDate

//userdata
1. 基础和特训 从下到上 activity->task
2. 挑战 从上倒下 task->activity

问题：
1. room的grade是年级的意思么？ 不用管
2. 进入班级的user只要有teacher就有管理权限 恩
3. 删除group 前后端都用roles 对
4. have_profile is_temp ok
5. q! 渠道没实现 正在做 
6. room manager备注 保留了
7. track地域 geo-ip-local
8. 重复完成status的timestamp会更新么？ 不会

