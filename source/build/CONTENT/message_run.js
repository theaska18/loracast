
// var chat = firebase.database().ref('/chat');
// var chat_status = firebase.database().ref('chat_status/'+_user_id);
// var chat_notif=firebase.database().ref('/Chat-notif/'+_user_id);
// firebase.database().ref('/Chat-tmp/'+_user_id).orderByChild('read').equalTo(false).on("value", function(snapshot) {
	// _notice('MESSAGE',snapshot.numChildren());
// });
// chat_notif.on('child_added', function(snapshot) {
	// var data = snapshot.val();
	// if(data.notif==true){
		// if(Ext.getCmp('MESSAGE.tab-'+data.last_user_id)!= undefined){
			// var myTabPanel=Ext.get('MESSAGE.tab-'+data.last_user_id);
			// console.log(myTabPanel);
			// if(Ext.getCmp('MESSAGE.tab') != undefined){
				// var t=new Audio(url+"vendor/sound/notif.mp3");t.play();
				// Ext.getCmp('MESSAGE.tab').setActiveTab(Ext.getCmp('MESSAGE.tab-'+data.last_user_id));
				// // alert('harus show');
				// if(_mobile==true){
					// Ext.getCmp('MESSAGE.list').hide();
				// }
				// Ext.getCmp('MESSAGE.tab').show();
			// }else{
				// _notif('Pesan',data.msg);
			// }
		// }else{
			// _notif('Pesan',data.msg);
		// }
		// chat_notif.set({notif:false});
	// }
// });
// chat_notif.on('child_changed', function(snapshot) {
	// var data = snapshot.val();
	// if(data.notif==true){
		// if(Ext.getCmp('MESSAGE.tab-'+data.last_user_id)!= undefined){
			// var myTabPanel=Ext.get('MESSAGE.tab-'+data.last_user_id);
			// console.log(myTabPanel);
			// if(Ext.getCmp('MESSAGE.tab') != undefined ){
				// var t=new Audio(url+"vendor/sound/notif.mp3");t.play();
				// Ext.getCmp('MESSAGE.tab').setActiveTab(Ext.getCmp('MESSAGE.tab-'+data.last_user_id));
				// Ext.getCmp('MESSAGE.tab').show();
			// }else{
				// _notif('Pesan',data.msg);
			// }
		// }else{
			// _notif('Pesan',data.msg);
		// }
		// chat_notif.set({notif:false});
	// }
// });
// setInterval(function(){
	// chat_status.update({
		// on:new Date(),
		// user_id:_user_id,
		// tenant_id:_tenant_id,
		// name:_user_name,
		// tenant_name:_tenant_name,
		// status:iif(getSetting('MESSAGE','ACTIVE')=='Y',true,false),
		// all:iif(getSetting('MESSAGE','PUBLIC')=='Y',true,false)
	// });
// },5000);

