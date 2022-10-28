import Vue from "vue";
import Router from "vue-router";
import store from '../store'
Vue.use(Router);

// 公共路由
const routes = [
	{
		path: "/",
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'home',
		component: () => import('@/views/ddLogin'),
		meta: {
			title: '典学'
		}
	}, {
		path: '/index',
		name: 'index',
		component: () => import('@/views/home/index'),
		meta: {
			title: '典学'
		}
	},
	{
		path: '/suggestions',
		name: 'suggestions',
		component: () => import('@/views/suggestions/index'),
		meta: {
			title: '意见建议'
		}
	},
	{
		path: '/suggestionsList',
		name: 'suggestionsList',
		component: () => import('@/views/suggestions/list'),
		meta: {
			title: '提交历史'
		}
	},
	{
		path: '/findStudent',
		name: 'findStudent',
		component: () => import('@/views/findStudent/index'),
		meta: {
			title: '找同学'
		}
	},
	{
		path: '/findTeacher',
		name: 'findTeacher',
		component: () => import('@/views/findTeacher/index'),
		meta: {
			title: '找导师'
		}
	},
	{
		path: '/teacherDetails',
		name: 'teacherDetails',
		component: () => import('@/views/findTeacher/details'),
		meta: {
			title: '名师主页'
		}
	},
	{
		path: '/tutorialTimeTree',
		name: 'tutorialTimeTree',
		component: () => import('@/views/tutorialTimeTree/index'),
		meta: {
			title: '导学时间树'
		}
	},
	{
		path: '/guidanceInformation',
		name: 'guidanceInformation',
		component: () => import('@/views/guidanceInformation/index'),
		meta: {
			title: '导学信息'
		}
	},
	{
		path: '/infoDetails',
		name: 'infoDetails',
		component: () => import('@/views/guidanceInformation/details'),
		meta: {
			title: '信息详情'
		}
	},
	{
		path: '/guideBoard',
		name: 'guideBoard',
		component: () => import('@/views/guideBoard/index'),
		meta: {
			title: '导学看板'
		}
	},
	{
		path: '/schoolBoard',
		name: 'schoolBoard',
		component: () => import('@/views/schoolBoard/index'),
		meta: {
			title: '校级看板'
		}
	},
	{
		path: '/organization',
		name: 'organization',
		component: () => import('@/views/organization/index'),
		meta: {
			title: '组织架构'
		}
	},
	{
		path: '/guidanceSpace',
		name: 'guidanceSpace',
		component: () => import('@/views/guidanceSpace/index'),
		meta: {
			title: '导学空间'
		}
	},
	{
		path: '/teamList',
		name: 'teamList',
		component: () => import('@/views/guidanceSpace/teamList'),
		meta: {
			title: '团队成员'
		}
	},
	{
		path: '/powerList',
		name: 'powerList',
		component: () => import('@/views/guidanceSpace/powerList'),
		meta: {
			title: '权限管理'
		}
	},
	{
		path: '/userGroup',
		name: 'userGroup',
		component: () => import('@/views/organization/userGroup'),
		meta: {
			title: '用户组'
		}
	},
	{
		path: '/messageAdd',
		name: 'messageAdd',
		component: () => import('@/views/guidanceSpace/messageAdd'),
		meta: {
			title: '发布动态'
		}
	},

	{
		path: '/fileList',
		name: 'fileList',
		component: () => import('@/views/guidanceSpace/fileList'),
		meta: {
			title: '资源分享'
		}
	},
	{
		path: '/groupSpace',
		name: 'groupSpace',
		component: () => import('@/views/groupSpace'),
		meta: {
			title: '组会空间'
		}
	},
	{
		path: '/addMeeting',
		name: 'addMeeting',
		component: () => import('@/views/groupSpace/addMeeting'),
		meta: {
			title: '发起会议'
		}
	},
	{
		path: '/remind',
		name: 'remind',
		component: () => import('@/views/groupSpace/remind'),
		meta: {
			title: '会议提醒设置'
		}
	},
	{
		path: '/detailsMeeting',
		name: 'detailsMeeting',
		component: () => import('@/views/groupSpace/detailsMeeting'),
		meta: {
			title: '组会空间' // 组会空间详情
		}
	},

	{
		path: '/addParticipant',
		name: 'addParticipant',
		component: () => import('@/views/groupSpace/addParticipant'),
		meta: {
			title: '添加参与人'
		}
	},
	{
		path: '/addGroupUser',
		name: 'addGroupUser',
		component: () => import('@/views/organization/addGroupUser'),
		meta: {
			title: '添加用户组成员'
		}
	},
	{
		path: '/addUser',
		name: 'addUser',
		component: () => import('@/views/organization/addUser'),
		meta: {
			title: '添加成员'
		}
	},
	{
		path: '/chooseList',
		name: 'chooseList',
		component: () => import('@/views/organization/chooseList'),
		meta: {
			title: '已选中成员'
		}
	},

	{
		path: '/studyProgress',
		name: 'studyProgress',
		component: () => import('@/views/studyProgress/index'),
		meta: {
			title: '学业进展'
		}
	},
	{
		path: '/detailsPreStudy',
		name: 'detailsPreStudy',
		component: () => import('@/views/studyProgress/detailsPreStudy'),
		meta: {
			title: '前置学业信息详情'
		}
	},
	
	{
		path: '/detailsCourse',
		name: 'detailsCourse',
		component: () => import('@/views/studyProgress/detailsCourse'),
		meta: {
			title: '课程详情'
		}
	},
	{
		path: '/detailsReading',
		name: 'detailsReading',
		component: () => import('@/views/studyProgress/detailsReading'),
		meta: {
			title: '读书报告'
		}
	},
	{
		path: '/detailsOpeningReport',
		name: 'detailsOpeningReport',
		component: () => import('@/views/studyProgress/detailsOpeningReport'),
		meta: {
			title: '开题报告'
		}
	},
	{
		path: '/detailsmMetaphase',
		name: 'detailsmMetaphase',
		component: () => import('@/views/studyProgress/detailsmMetaphase'),
		meta: {
			title: '中期考核'
		}
	},
	{
		path: '/detailsPreDefense',
		name: 'detailsPreDefense',
		component: () => import('@/views/studyProgress/detailsPreDefense'),
		meta: {
			title: '预答辩'
		}
	},
	{
		path: '/detailsScientific',
		name: 'detailsScientific',
		component: () => import('@/views/studyProgress/detailsScientific'),
		meta: {
			title: '科研成果'
		}
	},
	{
		path: '/detailsRewardPunishment',
		name: 'detailsRewardPunishment',
		component: () => import('@/views/studyProgress/detailsRewardPunishment'),
		meta: {
			title: '奖惩信息'
		}
	},
	{
		path: '/psychologicalTest',
		name: 'psychologicalTest',
		component: () => import('@/views/psychologicalTest/index'),
		meta: {
			title: '心理测试'
		}
	},
	{
		path: '/mentorPortrait',
		name: 'mentorPortrait',
		component: () => import('@/views/mentorPortrait/index'),
		meta: {
			title: '导师画像'
		}
	},
	{
		path: '/personalSpace',
		name: 'personalSpace',
		component: () => import('@/views/personalSpace/index'),
		meta: {
			title: '个人空间'
		}
	},

];



const router = new Router({
	mode: 'hash',
	base: process.env.BASE_URL,
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			// savedPosition is only available for popstate navigations.
			return savedPosition
		} else {
			// if (store.state.app.cachedViews.includes(to.name)) {
			// 	return null
			// }
			// return {
			// 	x: 0,
			// 	y: 0
			// }
		}
	},
	routes,
})



export default router