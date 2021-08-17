Ext.define('App.cmp.Config',{
	extend: 'Ext.Button',
	tooltip:'Config',
	iconCls:'fa fa-cog',
	text:'Config',
	tenant_id:_tenant_id,
	user_id:_user_id,
	role_id:null,
	code:[],
	level:3,
	initComponent:function(){
		var $this=this;
		$this.handler=function(){
			var cmpnya='';
			if($this.menuCode != undefined && $this.menuCode != null && $this.menuCode !=''){
				cmpnya=$this.menuCode;}else{cmpnya=Ext.getCmp(shortcut.getModule()).code;}
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			}
			var win=new Ext.Window({
				iconCls:'fa fa-cog',
				title:'Setting',
				modal:true,
				maxWidth:iif(_mobile==true,size.width,undefined),
				maxHeight:iif(_mobile==true,size.height,undefined),
				resizable:false,
				closeAction:'destroy',
				width: 700,
				fbar: [
					{
						text: 'Keluar',
						tooltip:'Keluar <b>[Esc]</b>',
						iconCls:'fa fa-close',
						handler: function() {
							win.close();
						}
					}
				],
				items:[
					{
						xtype:'ipanel',
						autoScroll: false,
						paddingBottom:false,
						items:[
							{
								xtype:'isetting',
								autoRefresh:true,
								level:$this.level,
								code:$this.code,
								height: 300,
								role_id:$this.role_id,
								menu_code:cmpnya,
								tenant_id:$this.tenant_id,
								user_id:$this.user_id
							}
						]
					}
				]
			}).show();
		}
		this.callParent(arguments);
	}
});