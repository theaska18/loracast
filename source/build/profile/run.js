/*
	import cmp.ipanel
*/
label="<div><div style='margin:0 10px;'>"+
	"<table><tr><td><img id='PROFILE-image' src='"+url+"upload/"+_tenant_logo+"' width='38' height='38' class='rounded-circle' alt='' style='border-radius: 50%;border: 3px solid white;'></td>"+
	"<td style='padding-left: 5px;'><font size='3'>"+_user_name+"</font>&nbsp;<a href=\'javascript:Ext.getCmp(\"main\").loadMenuByCode(\"PROFILE\");'><span class='i-menu-button-single' style='margin-top: -5px;'><span class='fa fa-edit '></span></span></a><br><font size='1' style='color: #aaa;'><span id='span-icon-gender' class='fa fa-male i-profile-detail'></span> <span id='span-profile-city'>NONE</span>, <span id='span-profile-age'>NONE</span> th</font></td></tr></table>"+
"</div></div>";
function loadProfile(){
	Ext.Ajax.request({
		url : url + 'cmd?m=PROFILE&f=initRun',
		params:{i:_employee_id},
		method : 'GET',
		success : function(response) {
			var r = ajaxSuccess(response);
			if (r.r == 'S') {
				var o=r.d;
				var home=Ext.getCmp('main.tab.home');
				var img='NO.GIF';
				if(o.f1!==null && o.f1 !==''){
					img=o.f1;
				}
				$('#PROFILE-image').attr('src',url+"upload/"+img);
				if(o.f4=='GENDER_P'){
					$('#span-icon-gender').removeClass('fa-male');
					$('#span-icon-gender').addClass('fa-female');
				}
				$('#span-profile-city').html(o.f5);
				$('#span-profile-age').html(o.f6);
				if(_access('PROFILE_show_app')==false){
					home.add({
						xtype:'ipanel',
						minWidth: 350,
						height:300,
						columnWidth:iif(_mobile==true,1,.33),
						border:true,
						margin:true,
						title:'Application',
						items:[
							{
								xtype:'idisplayfield',
								fieldLabel:'Application Name',
								value:_app_name,
								readOnly:true,
							},{
								xtype:'idisplayfield',
								fieldLabel:'Powered By',
								value:_app_powered,
								readOnly:true,
							},{
								xtype:'idisplayfield',
								fieldLabel:'Logo',
								height:120,
								value:"<img style='max-height: 100px;' src='"+ url+"vendor/images/18022018131106A.png' />"+
									"<img style='max-height: 100px;' src='"+ url+"vendor/images/ssl.png' />",
							}
						]
					});
				}
				if(_access('PROFILE_show_tenant')==false){
					home.add({
						xtype:'ipanel',
						minWidth: 350,
						height:300,
						columnWidth:iif(_mobile==true,1,.33),
						border:true,
						margin:true,
						title:'Tenant',
						items:[
							{
								xtype:'idisplayfield',
								fieldLabel:'Tenant Name',
								value:_tenant_name
							},{
								xtype:'idisplayfield',
								fieldLabel:'Tenant Address',
								value:_tenant_address
							},{
								xtype:'idisplayfield',
								fieldLabel:'Tenant Contact',
								value:_tenant_contact
							},{
								xtype:'idisplayfield',
								fieldLabel:'Logo',
								height:120,
								value:"<img style='max-height: 100px;' src='"+ url+"upload/"+_tenant_logo+"' />"
							}
						]
					});
				}
			}
		},
		failure : function(jqXHR, exception) {
			ajaxError(jqXHR, exception,true);
		}
	});
}
 loadProfile();