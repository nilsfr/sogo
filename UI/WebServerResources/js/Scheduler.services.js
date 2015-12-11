!function(){"use strict";function a(b){if(this.init(b),this.name&&!this.id){var c=a.$$resource.create("createFolder",this.name);this.$unwrap(c)}this.id&&(this.$acl=new a.$$Acl("Calendar/"+this.id))}a.$factory=["$q","$timeout","$log","sgSettings","Resource","Component","Acl",function(b,c,d,e,f,g,h){return angular.extend(a,{$q:b,$timeout:c,$log:d,$$resource:new f(e.activeUser("folderURL")+"Calendar",e.activeUser()),$Component:g,$$Acl:h,activeUser:e.activeUser(),$view:null}),a}];try{angular.module("SOGo.SchedulerUI")}catch(b){angular.module("SOGo.SchedulerUI",["SOGo.Common"])}angular.module("SOGo.SchedulerUI").value("CalendarSettings",{EventDragDayLength:96,EventDragHorizontalOffset:3}).factory("Calendar",a.$factory),a.$add=function(a){var b,c,d;b=a.isWebCalendar?this.$webcalendars:a.isSubscription?this.$subscriptions:this.$calendars,c=_.find(b,function(b){return"personal"!=b.id&&1===b.name.localeCompare(a.name)}),d=c?_.indexOf(_.pluck(b,"id"),c.id):1,b.splice(d,0,a)},a.$findAll=function(b,c){var d=this;return b&&(this.$calendars=[],this.$subscriptions=[],this.$webcalendars=[],angular.forEach(b,function(b,c){var e=new a(b);e.isWebCalendar?d.$webcalendars.push(e):e.isSubscription?d.$subscriptions.push(e):d.$calendars.push(e)})),c?_.union(this.$calendars,_.filter(this.$subscriptions,function(a){return a.acls.objectCreator})):_.union(this.$calendars,this.$subscriptions,this.$webcalendars)},a.$get=function(b){var c;return c=_.find(a.$calendars,function(a){return a.id==b}),c||(c=_.find(a.$subscriptions,function(a){return a.id==b})),c||(c=_.find(a.$webcalendars,function(a){return a.id==b})),c},a.$getIndex=function(b){var c;return c=_.indexOf(_.pluck(a.$calendars,"id"),b),0>c&&(c=_.indexOf(_.pluck(a.$subscriptions,"id"),b)),0>c&&(c=_.indexOf(_.pluck(a.$webcalendars,"id"),b)),c},a.$subscribe=function(b,c){var d=this;return a.$$resource.userResource(b).fetch(c,"subscribe").then(function(b){var c=new a(b);return _.find(d.$subscriptions,function(a){return a.id==b.id})||a.$add(c),c})},a.$addWebCalendar=function(b){var c=this,d=a.$q.defer();return _.find(c.$webcalendars,function(a){return a.urls.webCalendarURL==b})?d.reject():a.$$resource.post(null,"addWebCalendar",{url:b}).then(function(c){angular.extend(c,{isWebCalendar:!0,isEditable:!0,isRemote:!1,owner:a.activeUser.login,urls:{webCalendarURL:b}});var e=new a(c);a.$add(e),a.$$resource.fetch(e.id,"reload").then(function(b){a.$log.debug(JSON.stringify(b,void 0,2))}),d.resolve()},function(){d.reject()}),d.promise},a.$deleteComponents=function(b){var c={},d=this;_.forEach(b,function(a){angular.isDefined(c[a.c_folder])||(c[a.c_folder]=[]),c[a.c_folder].push(a.c_name)}),_.forEach(c,function(b,c){a.$$resource.post(c,"batchDelete",{uids:b})}),d.$Component.$events=_.difference(d.$Component.$events,b),d.$Component.$tasks=_.difference(d.$Component.$tasks,b)},a.prototype.init=function(b){this.color=this.color||"#AAAAAA",angular.extend(this,b),this.isOwned=a.activeUser.isSuperUser||this.owner==a.activeUser.login,this.isSubscription=!this.isRemote&&this.owner!=a.activeUser.login,angular.isUndefined(this.$shadowData)&&(this.$shadowData=this.$omit())},a.prototype.$id=function(){return this.id?a.$q.when(this.id):this.$futureCalendarData.then(function(a){return a.id})},a.prototype.getClassName=function(a){return angular.isUndefined(a)&&(a="fg"),a+"-folder"+this.id},a.prototype.$rename=function(){var b,c,d=this;return this.name==this.$shadowData.name?a.$q.when():(c=this.isWebCalendar?a.$webcalendars:this.isSubscription?a.$subscriptions:a.$calendars,b=_.indexOf(_.pluck(c,"id"),this.id),b>-1?this.$save().then(function(){c.splice(b,1),a.$add(d)}):a.$q.reject())},a.prototype.$delete=function(){var b,c,d=this;return this.isSubscription?(c=a.$$resource.fetch(this.id,"unsubscribe"),b=a.$subscriptions):(c=a.$$resource.remove(this.id),b=this.isWebCalendar?a.$webcalendars:a.$calendars),c.then(function(){var a=_.indexOf(_.pluck(b,"id"),d.id);b.splice(a,1)})},a.prototype.$reset=function(){var a=this;angular.forEach(this,function(b,c){"constructor"!=c&&"$"!=c[0]&&delete a[c]}),angular.extend(this,this.$shadowData),this.$shadowData=this.$omit()},a.prototype.$save=function(){var b=this;return a.$$resource.save(this.id,this.$omit()).then(function(a){return b.$shadowData=b.$omit(),a},function(c){return a.$log.error(JSON.stringify(c,void 0,2)),b.$reset(),c})},a.prototype.$setActivation=function(){return a.$$resource.fetch(this.id,(this.active?"":"de")+"activateFolder")},a.prototype.$getComponent=function(b,c){return a.$Component.$find(this.id,b,c)},a.prototype.$unwrap=function(b){var c=this;this.$futureCalendarData=b.then(function(b){return a.$timeout(function(){return c.init(b),c})},function(b){c.isError=!0,angular.isObject(b)&&a.$timeout(function(){angular.extend(c,b)})})},a.prototype.$omit=function(){var a={};return angular.forEach(this,function(b,c){"constructor"!=c&&"$"!=c[0]&&(a[c]=b)}),a}}(),function(){"use strict";function a(b){if("function"!=typeof b.then){if(this.init(b),this.pid&&!this.id){var c=a.$$resource.newguid(this.pid);this.$unwrap(c),this.isNew=!0}}else this.$unwrap(b)}a.$factory=["$q","$timeout","$log","sgSettings","Preferences","Gravatar","Resource",function(b,c,d,e,f,g,h){return angular.extend(a,{$q:b,$timeout:c,$log:d,$Preferences:f,$gravatar:g,$$resource:new h(e.baseURL(),e.activeUser()),timeFormat:"%H:%M",$query:{value:"",search:"title_Category_Location"},$queryEvents:{sort:"start",asc:1,filterpopup:"view_next7"},$queryTasks:{sort:"status",asc:1,filterpopup:"view_incomplete"},$refreshTimeout:null,$ghost:{}}),f.ready().then(function(){f.settings.Calendar.EventsFilterState&&(a.$queryEvents.filterpopup=f.settings.Calendar.EventsFilterState),f.settings.Calendar.TasksFilterState&&(a.$queryTasks.filterpopup=f.settings.Calendar.TasksFilterState),f.settings.Calendar.EventsSortingState&&(a.$queryEvents.sort=f.settings.Calendar.EventsSortingState[0],a.$queryEvents.asc=parseInt(f.settings.Calendar.EventsSortingState[1])),f.settings.Calendar.TasksSortingState&&(a.$queryTasks.sort=f.settings.Calendar.TasksSortingState[0],a.$queryTasks.asc=parseInt(f.settings.Calendar.TasksSortingState[1])),a.$queryTasks.show_completed=parseInt(f.settings.ShowCompletedTasks),a.$categories=f.defaults.SOGoCalendarCategoriesColors,f.defaults.SOGoTimeFormat&&(a.timeFormat=f.defaults.SOGoTimeFormat)}),a}];try{angular.module("SOGo.SchedulerUI")}catch(b){angular.module("SOGo.SchedulerUI",["SOGo.Common"])}angular.module("SOGo.SchedulerUI").factory("Component",a.$factory),a.$selectedCount=function(){var b;return b=0,a.$events&&(b+=_.filter(a.$events,function(a){return a.selected}).length),a.$tasks&&(b+=_.filter(a.$tasks,function(a){return a.selected}).length),b},a.$startRefreshTimeout=function(b){var c=this;a.$refreshTimeout&&a.$timeout.cancel(a.$refreshTimeout),a.$Preferences.ready().then(function(){var d=a.$Preferences.defaults.SOGoRefreshViewCheck;if(d&&"manually"!=d){var e=angular.bind(c,a.$filter,b);a.$refreshTimeout=a.$timeout(e,1e3*d.timeInterval())}})},a.$filter=function(b,c){var d=this,e=new Date,f=e.getDate(),g=e.getMonth()+1,h=e.getFullYear(),i="$query"+b.capitalize(),j={day:""+h+(10>g?"0":"")+g+(10>f?"0":"")+f};return a.$startRefreshTimeout(b),this.$Preferences.ready().then(function(){var e,f,g=!1;return angular.extend(d.$query,j),c&&_.each(_.keys(c),function(b){g|=d.$query[b]&&c[b]!=a.$query[b],"reload"==b&&c[b]?g=!0:angular.isDefined(d.$query[b])?d.$query[b]=c[b]:d[i][b]=c[b]}),e=d.$$resource.fetch(null,b+"list",angular.extend(d[i],d.$query)),f="tasks"==b?"$events":"$tasks",g&&(delete a[f],a.$log.debug("force reload of "+f)),d.$unwrapCollection(b,e)})},a.$find=function(b,c,d){var e,f=[b,c];return d&&f.push(d),e=this.$$resource.fetch(f.join("/"),"view"),new a(e)},a.filterCategories=function(b){var c=new RegExp(b,"i");return _.filter(_.keys(a.$categories),function(a){return-1!=a.search(c)})},a.saveSelectedList=function(a){return this.$$resource.post(null,"saveSelectedList",{list:a+"ListView"})},a.$eventsBlocksForView=function(a,b){var c,d,e;return"day"==a?(c="dayView",d=e=b):"multicolumnday"==a?(c="multicolumndayView",d=e=b):"week"==a?(c="weekView",d=b.beginOfWeek(),e=new Date,e.setTime(d.getTime()),e.addDays(6)):"month"==a&&(c="monthView",d=b,d.setDate(1),d=d.beginOfWeek(),e=new Date,e.setTime(d.getTime()),e.setMonth(e.getMonth()+1),e.addDays(-1),e=e.endOfWeek()),this.$eventsBlocks(c,d,e)},a.$eventsBlocks=function(b,c,d){var e,f,g,h,i=[],j=a.$q.defer();return e={view:b.toLowerCase(),sd:c.getDayString(),ed:d.getDayString()},a.$log.debug("eventsblocks "+JSON.stringify(e,void 0,2)),f=this.$$resource.fetch(null,"eventsblocks",e),f.then(function(b){var d,e;d=function(b,c,d){var e=_.object(this.eventsFields,c),f=new Date(1e3*e.c_startdate);return e.hour=f.getHourString(),e.blocks=[],b.push(new a(e)),b},e=function(a){this[a.nbr].blocks.push(a),a.component=this[a.nbr]},a.$views=[],a.$timeout(function(){_.forEach(b,function(b){var f,j=[],k={},l={};if(b.eventsFields.splice(_.indexOf(b.eventsFields,"c_folder"),1,"pid"),b.eventsFields.splice(_.indexOf(b.eventsFields,"c_name"),1,"id"),b.eventsFields.splice(_.indexOf(b.eventsFields,"c_recurrence_id"),1,"occurrenceId"),b.eventsFields.splice(_.indexOf(b.eventsFields,"c_title"),1,"summary"),_.reduce(b.events,d,j,b),_.forEach(_.flatten(b.blocks),e,j),_.each(_.flatten(b.allDayBlocks),e,j),0===i.length)for(g=0;g<b.blocks.length;g++)i.push(c.getDayString()),c.addDays(1);for(g=0;g<b.blocks.length;g++){for(h=0;h<b.blocks[g].length;h++)b.blocks[g][h].dayNumber=g;k[i[g]]=b.blocks[g]}for(g=0;g<b.allDayBlocks.length;g++){for(h=0;h<b.allDayBlocks[g].length;h++)b.allDayBlocks[g][h].dayNumber=g;l[i[g]]=b.allDayBlocks[g]}a.$log.debug("blocks ready ("+_.flatten(b.blocks).length+")"),a.$log.debug("all day blocks ready ("+_.flatten(b.allDayBlocks).length+")"),f={blocks:k,allDayBlocks:l},b.id&&b.calendarName&&(f.id=b.id,f.calendarName=b.calendarName),a.$views.push(f)}),j.resolve(a.$views)})},j.reject),j.promise},a.$unwrapCollection=function(b,c){var d=[];return c.then(function(c){return a.$timeout(function(){var e=_.invoke(c.fields,"toLowerCase");return e.splice(_.indexOf(e,"c_folder"),1,"pid"),e.splice(_.indexOf(e,"c_name"),1,"id"),e.splice(_.indexOf(e,"c_recurrence_id"),1,"occurrenceId"),_.reduce(c[b],function(b,c,d){var f=_.object(e,c);return b.push(new a(f)),b},d),a.$log.debug("list of "+b+" ready ("+d.length+")"),a["$"+b]=d,d})})},a.prototype.init=function(b){var c=this;if(this.categories=[],this.repeat={},this.alarm={action:"display",quantity:5,unit:"MINUTES",reference:"BEFORE",relation:"START"},this.status="not-specified",this.delta=60,angular.extend(this,b),a.$Preferences.ready().then(function(){var b="appointment"==c.type?"Events":"Tasks";c.classification=c.classification||a.$Preferences.defaults["SOGoCalendar"+b+"DefaultClassification"].toLowerCase()}),"vevent"==this.component?this.type="appointment":"vtoto"==this.component&&(this.type="task"),this.startDate?angular.isString(this.startDate)?this.start=new Date(this.startDate.substring(0,10)+" "+this.startDate.substring(11,16)):this.start=this.startDate:"appointment"==this.type&&(this.start=new Date,this.start.setMinutes(15*Math.round(this.start.getMinutes()/15))),this.endDate?(this.end=new Date(this.endDate.substring(0,10)+" "+this.endDate.substring(11,16)),this.delta=this.start.minutesTo(this.end)):"appointment"==this.type&&this.setDelta(this.delta),this.dueDate&&(this.due=new Date(this.dueDate.substring(0,10)+" "+this.dueDate.substring(11,16))),this.c_category&&(this.categories=_.invoke(this.c_category,"asCSSIdentifier")),this.$isRecurrent=angular.isDefined(b.repeat),this.repeat.days){var d=_.find(this.repeat.days,function(a){return angular.isDefined(a.occurrence)});d&&"yearly"==this.repeat.frequency&&(this.repeat.year={byday:!0}),this.repeat.month={type:"byday",occurrence:d.occurrence.toString(),day:d.day}}else this.repeat.days=[];angular.isUndefined(this.repeat.frequency)&&(this.repeat.frequency="never"),angular.isUndefined(this.repeat.interval)&&(this.repeat.interval=1),angular.isUndefined(this.repeat.month)&&(this.repeat.month={occurrence:"1",day:"SU",type:"bymonthday"}),angular.isUndefined(this.repeat.monthdays)&&(this.repeat.monthdays=[]),angular.isUndefined(this.repeat.months)&&(this.repeat.months=[]),angular.isUndefined(this.repeat.year)&&(this.repeat.year={}),this.repeat.count?this.repeat.end="count":this.repeat.until?(this.repeat.end="until",this.repeat.until=this.repeat.until.substring(0,10).asDate()):this.repeat.end="never",this.$hasCustomRepeat=this.hasCustomRepeat(),this.isNew?a.$Preferences.ready().then(function(){var b={M:"MINUTES",H:"HOURS",D:"DAYS",W:"WEEKS"},d=/-PT?([0-9]+)([MHDW])/.exec(a.$Preferences.defaults.SOGoCalendarDefaultReminder);d&&(c.$hasAlarm=!0,c.alarm.quantity=parseInt(d[1]),c.alarm.unit=b[d[2]])}):this.$hasAlarm=angular.isDefined(b.alarm),this.destinationCalendar=this.pid,this.updateFreeBusy(),this.selected=!1},a.prototype.hasCustomRepeat=function(){var a=angular.isDefined(this.repeat)&&(this.repeat.interval>1||this.repeat.days&&this.repeat.days.length>0||this.repeat.monthdays&&this.repeat.monthdays.length>0||this.repeat.months&&this.repeat.months.length>0);return a},a.prototype.isEditable=function(){return!this.occurrenceId&&!this.isReadOnly},a.prototype.isEditableOccurrence=function(){return this.occurrenceId&&!this.isReadOnly},a.prototype.isInvitation=function(){return!this.occurrenceId&&this.userHasRSVP},a.prototype.isInvitationOccurrence=function(){return this.occurrenceId&&this.userHasRSVP},a.prototype.isReadOnly=function(){return this.isReadOnly&&!this.userHasRSVP},a.prototype.enablePercentComplete=function(){return"task"==this.type&&"not-specified"!=this.status&&"cancelled"!=this.status},a.prototype.coversFreeBusy=function(a,b,c){var d=angular.isDefined(this.freebusy[a])&&angular.isDefined(this.freebusy[a][b])&&1==this.freebusy[a][b][c];return d},a.prototype.updateFreeBusyCoverage=function(){var a=this,b={};if(this.start&&this.end){var c=new Date(this.start.getTime()),d=new Date(this.end.getTime()),e=parseInt(c.getMinutes()/15+.5),f=parseInt(d.getMinutes()/15+.5);return c.setMinutes(15*e),d.setMinutes(15*f),_.each(c.daysUpTo(d),function(c,d){var f,g=c.getDate(),h=c.getDayString();if(h==a.start.getDayString())for(f=c.getHours().toString(),b[h]={},b[h][f]=[];e>0;)b[h][f].push(0),e--;else c=c.beginOfDay(),b[h]={};for(;c.getTime()<a.end.getTime()&&c.getDate()==g;)f=c.getHours().toString(),angular.isUndefined(b[h][f])&&(b[h][f]=[]),b[h][f].push(1),c.addMinutes(15)}),b}},a.prototype.updateFreeBusy=function(){var b=this;this.freebusy=this.updateFreeBusyCoverage(),this.attendees&&_.each(this.attendees,function(c){c.image=a.$gravatar(c.email,32),b.updateFreeBusyAttendee(c)})},a.prototype.setDelta=function(a){this.delta=a,this.end=new Date(this.start.getTime()),this.end.setMinutes(15*Math.round(this.end.getMinutes()/15)),this.end.addMinutes(this.delta)},a.prototype.updateFreeBusyAttendee=function(b){var c,d,e;b.uid&&(c={sday:this.start.getDayString(),eday:this.end.getDayString()},d=["..","..",b.uid,"freebusy.ifb"],e=_.map(this.start.daysUpTo(this.end),function(a){return a.getDayString()}),angular.isUndefined(b.freebusy)&&(b.freebusy={}),a.$$resource.fetch(d.join("/"),"ajaxRead",c).then(function(a){_.each(e,function(c){var d;angular.isUndefined(b.freebusy[c])&&(b.freebusy[c]={}),angular.isUndefined(a[c])&&(a[c]={});for(var e=0;23>=e;e++)d=e.toString(),a[c][d]?b.freebusy[c][d]=[a[c][d][0],a[c][d][15],a[c][d][30],a[c][d][45]]:b.freebusy[c][d]=[0,0,0,0]})}))},a.prototype.getClassName=function(a){return angular.isUndefined(a)&&(a="fg"),a+"-folder"+(this.destinationCalendar||this.c_folder||this.pid)},a.prototype.addAttendee=function(b){var c;b&&(c={name:b.c_cn,email:b.$preferredEmail(),role:"req-participant",status:"needs-action",uid:b.c_uid},_.find(this.attendees,function(a){return a.email==c.email})||(c.image=a.$gravatar(c.email,32),this.attendees?this.attendees.push(c):this.attendees=[c],this.updateFreeBusyAttendee(c)))},a.prototype.hasAttendee=function(a){var b=_.find(this.attendees,function(b){return _.find(a.emails,function(a){return a.value==b.email})});return angular.isDefined(b)},a.prototype.deleteAttendee=function(a){var b=_.findIndex(this.attendees,function(b){return b.email==a.email});this.attendees.splice(b,1)},a.prototype.canRemindAttendeesByEmail=function(){return"email"==this.alarm.action&&!this.isReadOnly&&this.attendees&&this.attendees.length>0},a.prototype.addAttachUrl=function(a){if(angular.isUndefined(this.attachUrls))this.attachUrls=[{value:a}];else{for(var b=0;b<this.attachUrls.length&&this.attachUrls[b].value!=a;b++);b==this.attachUrls.length&&this.attachUrls.push({value:a})}return this.attachUrls.length-1},a.prototype.deleteAttachUrl=function(a){a>-1&&this.attachUrls.length>a&&this.attachUrls.splice(a,1)},a.prototype.$addDueDate=function(){this.due=new Date,this.due.setMinutes(15*Math.round(this.due.getMinutes()/15)),this.dueDate=this.due.toISOString()},a.prototype.$deleteDueDate=function(){delete this.due,delete this.dueDate},a.prototype.$addStartDate=function(){this.start=new Date,this.start.setMinutes(15*Math.round(this.start.getMinutes()/15))},a.prototype.$deleteStartDate=function(){delete this.start,delete this.startDate},a.prototype.$reset=function(){var a=this;angular.forEach(this,function(b,c){"constructor"!=c&&"$"!=c[0]&&delete a[c]}),this.init(this.$shadowData),this.$shadowData=this.$omit(!0)},a.prototype.$reply=function(){var b,c=this,d=[this.pid,this.id];return this.occurrenceId&&d.push(this.occurrenceId),b={reply:this.reply,delegatedTo:this.delegatedTo,alarm:this.$hasAlarm?this.alarm:{}},a.$$resource.save(d.join("/"),b,{action:"rsvpAppointment"}).then(function(a){return c.$shadowData=c.$omit(!0),a})},a.prototype.$adjust=function(b){var c=[this.pid,this.id];return _.every(_.values(b),function(a){return 0===a})?a.$q.when():(this.occurrenceId&&c.push(this.occurrenceId),a.$log.debug("adjust "+c.join("/")+" "+JSON.stringify(b)),a.$$resource.save(c.join("/"),b,{action:"adjust"}))},a.prototype.$save=function(){var b,c=this,d=[this.pid,this.id];return this.isNew&&(b={action:"saveAs"+this.type.capitalize()}),this.occurrenceId&&d.push(this.occurrenceId),a.$$resource.save(d.join("/"),this.$omit(),b).then(function(a){return c.$shadowData=c.$omit(!0),a})},a.prototype.remove=function(b){var c=[this.pid,this.id];return b&&this.occurrenceId&&c.push(this.occurrenceId),a.$$resource.remove(c.join("/"))},a.prototype.$unwrap=function(b){var c=this;this.$futureComponentData=b,this.$futureComponentData.then(function(a){c.init(a),c.$shadowData=c.$omit()},function(b){angular.extend(c,b),c.isError=!0,a.$log.error(c.error)})},a.prototype.$omit=function(){function a(a){var b=a.getHours();10>b&&(b="0"+b);var c=a.getMinutes();return 10>c&&(c="0"+c),b+":"+c}function b(a){var b=a.getYear();1e3>b&&(b+=1900);var c=""+(a.getMonth()+1);1==c.length&&(c="0"+c);var d=""+a.getDate();return 1==d.length&&(d="0"+d),b+"-"+c+"-"+d}var c={};return angular.forEach(this,function(a,b){"constructor"!=b&&"$"!=b[0]&&"blocks"!=b&&(c[b]=angular.copy(a))}),c.startDate=c.start?b(c.start):"",c.startTime=c.start?a(c.start):"",c.endDate=c.end?b(c.end):"",c.endTime=c.end?a(c.end):"",c.dueDate=c.due?b(c.due):"",c.dueTime=c.due?a(c.due):"",this.$hasCustomRepeat?"monthly"==this.repeat.frequency&&this.repeat.month.type&&"byday"==this.repeat.month.type||"yearly"==this.repeat.frequency&&this.repeat.year.byday?(delete c.repeat.monthdays,c.repeat.days=[{day:this.repeat.month.day,occurrence:this.repeat.month.occurrence.toString()}]):this.repeat.month.type&&delete c.repeat.days:this.repeat.frequency&&(c.repeat={frequency:this.repeat.frequency}),this.repeat.frequency?"until"==this.repeat.end&&this.repeat.until?c.repeat.until=this.repeat.until.stringWithSeparator("-"):"count"==this.repeat.end&&this.repeat.count?c.repeat.count=this.repeat.count:(delete c.repeat.until,delete c.repeat.count):delete c.repeat,this.$hasAlarm?!this.alarm.action||"email"!=this.alarm.action||this.attendees&&this.attendees.length>0||(this.alarm.attendees=0,this.alarm.organizer=1):c.alarm={},c},a.prototype.repeatDescription=function(){var a=null;return this.repeat&&(a=l("repeat_"+this.repeat.frequency.toUpperCase())),a},a.prototype.alarmDescription=function(){var a,b=null;return this.alarm&&(a=["reminder"+this.alarm.quantity,this.alarm.unit,this.alarm.reference].join("_"),b=l(a),a===b&&(b=[this.alarm.quantity,l("reminder_"+this.alarm.unit),l("reminder_"+this.alarm.reference)].join(" "))),b},a.prototype.toString=function(){return"[Component "+this.id+"]"}}();
//# sourceMappingURL=Scheduler.services.js.map