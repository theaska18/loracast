Ext.define('App.cmp.Input',{
	extend: 'Ext.Panel',
	label:'',
	xWidth:96,
	q:{type:'input'},
	yWidth:'auto',
	separator:':',
	nullData:true,
	separatorWidth:9,
	layout:{type:'hbox',align:'stretch'},
	bold:false,
	margin:true,
	cls:'i-input',
	bodyStyle:' background: transparent;',
	border:false,
	initComponent:function(){
		var cmp=this.items,$this=this,nullData='';
		if($this.tooltip != undefined)
			cmp.push({xtype:'button',tabIndex:-1,iconCls:'fa fa-info-circle',tooltip:$this.tooltip,border: 0,style:'background: none;'});
		if($this.bold==true){$this.label='<b>'+$this.label+'</b>';}
		if(this.nullData==false){nullData='<font color="red">*</font>';}
		this.items=[
			{
				xtype:'panel',
				layout:'column',
				border:false,
				cls:'i-transparent i-input-label',
				bodyStyle:'background: transparent;',
				border:false,
				items:[
					{
						xtype:'displayfield',
						q:{type:'displayfield'},
						value:this.label+nullData,
						width:this.xWidth
					},{
						xtype:'displayfield',
						q:{type:'displayfield'},
						value:this.separator,
						width:this.separatorWidth
					}
				]
			},{
				xtype:'panel',
				layout:'column',
				flex:1,
				cls:'i-transparent',
				bodyStyle:'background: transparent;',
				width:this.yWidth,
				border:false,
				items:cmp
			}
		]
		this.callParent(arguments);
	}
});