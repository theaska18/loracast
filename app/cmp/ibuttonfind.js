/*
	import cmp.itablegrid
	import cmp.itable
	import cmp.ipanel
*/
_var.ButtonFind={id:null};
Ext.define('IButtonFind', {
	alias:'widget.ibuttonfind',
	extend : 'Ext.Button',
	tooltip:'Search',
	iconCls:'fa fa-search',
	windowWidth:700,
	header:true,
	labelTop:false,
	windowHeight:400,
	window:null,
	windowClose:function(){var $this=this;$this.window.close();},
	refresh:function(){Ext.getCmp(this.id+'_grid').refresh();},
	initComponent:function(){
		if(this.labelTop==true){this.style=iif(_mobile==true,'margin-top: 23px;','margin-top: 20px;');}
		this.callParent(arguments);
	},
	handler:function(a){
		var $this=this;
		_var.ButtonFind.id=$this.id;
		for(var i=0,iLen=$this.items.length; i<iLen; i++){
			$this.items[i].press={};
			$this.items[i].press.enter=function(){Ext.getCmp($this.id+'_grid').refresh();}
		}
		if(Ext.getCmp($this.id+'_window') != undefined){$this.window=Ext.getCmp($this.id+'_window');}
		else{
			var tableType='itablegrid';
			if($this.urlData!=undefined && $this.urlData != ''){tableType='itable';}
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			};
			$this.window=new Ext.Window({
				closeAction:'close',
				modal:true,
				header:$this.header,
				layout:'fit',
				autoScroll: true,
				style:iif(_mobile==true,'padding:0 ;',''),
				collapsed:iif(_mobile==true,true,false),
				maximized:_mobile,
				maxWidth:iif(_mobile==true,size.width,undefined),
				maxHeight:iif(_mobile==true,size.height,undefined),
				id:$this.id+'_window',
				constrain:true,
				title:'Search',
				listeners:{
					hide:function(){
						shortcut.remove('buttonFind');
						if($this.onHideWindow != undefined){$this.onHideWindow($this,$this.window,Ext.getCmp($this.id+'_grid'),Ext.getCmp($this.id+'_panel'));}
						Ext.getCmp($this.id+'_panel').qReset();
					},show:function(){
						if($this.onBeforeShow != undefined){$this.onBeforeShow($this,$this.window,Ext.getCmp($this.id+'_grid'),Ext.getCmp($this.id+'_panel'));}
					}
				},
				items:[
					{
						xtype:'ipanel',
						width:$this.windowWidth,
						height:$this.windowHeight,
						paddingBottom:false,
						border:false,
						autoScroll: true,
						layout:{type:'vbox',align:'stretch'},
						items:[
							{
								xtype:'ipanel',
								layout:'column',
								id:$this.id+'_panel',
								cls:'i-transparent',
								items:$this.items
							},{
								xtype:tableType,
								flex: 1,
								id:$this.id+'_grid',
								autoRefresh:false,
								url: $this.urlData,
								onAfterRefresh:function(a,b){
									if(b.length>0){a.getSelectionModel().select(0);}
									else{if(Ext.getCmp($this.id+'_panel').items.items[0] != undefined && Ext.getCmp($this.id+'_panel').items.items[0].focus != undefined){Ext.getCmp($this.id+'_panel').items.items[0].focus();}}
								},
								onClick:function(view, a, b, record){if($this.onDblClick != undefined){$this.onDblClick(record.data,$this);}},
								tbar:[
									{
										text:'Search',
										iconCls:'fa fa-search',
										handler:function(){Ext.getCmp($this.id+'_grid').refresh();}
									}
								],
								result:function(response){
									return {list:response.d,total:response.t};
								},
								params:function(bo){
									var param={};
									if($this.urlData!= undefined && $this.urlData !=''){
										param= Ext.getCmp($this.id+'_panel').qParams();
									}else{
										if($this.getParameter != undefined){param = $this.getParameter();}
										else{param= Ext.getCmp($this.id+'_panel')._parameter();}
									}
									// console.log(Ext.getCmp($this.id));
									//Ext.getCmp(Ext.getCmp($this.id+'_button').id_parent)
									//console.log(Ext.getCmp(Ext.getCmp($this.id).id_parent));
									if(Ext.getCmp(Ext.getCmp($this.id).id_parent).getParameter != undefined){
										var he=Ext.getCmp(Ext.getCmp($this.id).id_parent).getParameter();
										for (var key in he){
											param[key]=he[key];
										}
									}
									// 
									return param;
								},
								database:$this.database,
								fn:{select:function(a){if($this.onEnter != undefined){$this.onEnter(a,$this);}}},
								press:{enter:function(a){Ext.getCmp($this.id+'_grid').fn.select(a.dataRow);}},
								columns:$this.columns
							}
						]
					}
				]
			});
		}
		$this.window.show().center();
		Ext.getCmp($this.id+'_grid').refresh();
		if(Ext.getCmp($this.id+'_panel').items.items[0] != undefined && Ext.getCmp($this.id+'_panel').items.items[0].focus != undefined){Ext.getCmp($this.id+'_panel').items.items[0].focus();}
		shortcut.set({
			code:'buttonFind',
			list:[
				{
					key:'ctrl+f',
					fn:function(){
						if(Ext.getCmp(_var.ButtonFind.id+'_panel').items.items[0] != undefined && Ext.getCmp(_var.ButtonFind.id+'_panel').items.items[0].focus != undefined){
							Ext.getCmp(_var.ButtonFind.id+'_panel').items.items[0].focus();
						}
					}
				}
			]
		});
	}
});