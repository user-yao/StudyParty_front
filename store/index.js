import { createStore } from "vuex";
import article from './article/article';
import articleComment from './article/articleComment';
import articleUser from './article/articleUser';
import task from './article/task';
import taskAnswer from './article/taskAnswer';
import group from './group/group';
import groupJoin from './group/groupJoin';
import groupTask from './group/groupTask';
import groupTaskAnswer from './group/groupTaskAnswer';
import groupUser from './group/groupUser';
import user from './user/user';
import userPlan from "./user/userPlan";
import userTask from "./user/userTask";
import userFriend from "./user/userFriend";
import AI from "./AI/AI";
import userArticle from "./user/userArticle";

const store = createStore({
  modules: {
    user,
	userPlan,
	userTask,
	userFriend,
    AI,
    userArticle,
    group,
    article,
    articleComment,
    task,
    taskAnswer,
    groupJoin,
    groupTask,
    groupTaskAnswer,
    groupUser,
    articleUser
  }
});
export default store;