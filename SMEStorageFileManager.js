if(  typeof(SMEStorageFM)!='undefined'  ){
	if(  typeof(SMEStorageFM.contextMenu)!='undefined'  ){
		SMEStorageFM.contextMenu.removeAll();
	}
}

with(SMEStorageFileManager=function(){							//	Constructor
	this.userInfo['token']='*';
	this.userInfo['autologincode']='';
	this.userInfo['userid']='';
	this.userInfo['userid']='YOUR USERNAME HERE';
	this.userInfo['login']='YOUR PASSWORD HERE';

	if(  navigator.appName=='Opera'  ){
		this.brouser=navigator.appName;
	}
}){
	prototype.tree;
	prototype.treeId="mainTreeFileManager";
	prototype.treeGr;
	prototype.searchMainTreeTimer;

	prototype.pathToScript='../';
	prototype.pathToIcons=prototype.pathToScript + 'icons/';
	prototype.pathToFileIcons=prototype.pathToScript + 'fileicons/';
	prototype.script_for_resend_request=prototype.pathToScript + 'SMEStorageFileManager.php?p=';

	prototype.server_sme='http://smestorage.com';
	prototype.server_sme_api='http://smestorage.com/api';

	prototype.brouser="";

	prototype.userInfo=new Array();
	prototype.mainTree=new Array();
	prototype.groupTree=0;
	prototype.rootNode;
	prototype.contextMenu;
	prototype.showMessageMoveFilesInBackground=1;

	prototype.countFiles=50;
	prototype.countShadowFoldes=0;

	prototype.waitResult=0;
	prototype.waitResult2=0;
	prototype.responseData='';
	prototype.rqP='';
	prototype.timerID='';
	prototype.modalbox="";
	prototype.showMessageMoveFilesInBackground=1;
	prototype.externalName="";

//------------------------------------------------------------------------------------------
	prototype.searchMainTree=function(){
		if( document.getElementById(this.treeId) ){
			this.initAll();
			this.createFileManagerTree();
		}else{
			setTimeout(this.externalName + ".searchMainTree();", 250);
		}
	}
//------------------------------------------------------------------------------------------
	prototype.initAll=function(){
		this.tree='';
		this.treeGr='';
		this.searchMainTreeTimer='';

		this.mainTree=new Array();
		this.groupTree='';
		this.rootNode='';
		this.contextMenu=null;

		this.waitResult=0;
		this.waitResult2=0;
		this.responseData='';

		this.rqP='';
		this.timerID=-1;
		this.modalbox="";

		this.userInfo['token']='*';
		this.userInfo['autologincode']='';
		this.userInfo['userid']='';
	}
//------------------------------------------------------------------------------------------
	prototype.userTryOpenNode=function(Node){
		var id=Node.id;
		var L=0;
		id=id.replace(this.treeId, '');

		if( id==0 ){
			this.clearPanel(this.treeId);
		}

		var i=0;
		if( id!=0 ){
			while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
				if(  this.mainTree[i]["id"]==id  ){
					if(  this.mainTree[i]['loaded']==1  ){
						return 0;
					}

					if(  this.mainTree[i]['type']==5  ){
						var n=0;
						var j=0;
						while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[j])!='undefined')  ){
							if(  this.mainTree[j]["pid"]==id  ){
								if(  this.mainTree[j]['showed']==0  ){
									this.addElementToPanel(this.treeId, this.mainTree[j], this.mainTree[j]["pid"]);
									this.mainTree[j]['showed'] = 1;
									n++;
								}
							}
							j++;
						}// while
					}// if

					if( n>0 ){
						return 0;
					}
				}
				i++;
			}
		}

		this.getFilesList(id);
	}
//------------------------------------------------------------------------------------------
	prototype.createFileManagerTree=function(){
		var thisObject=this;

		this.rootNode = new Ext.tree.AsyncTreeNode({
			expanded: false,
			text: 'All files',
			id: this.treeId + '0',
			leaf: false,
			children: []
		});

		this.contextMenu = new Ext.menu.Menu({items: []});
		this.contextMenu.removeAll();

		this.contextMenu = new Ext.menu.Menu({
			items: [
			{
				id: this.treeId + 'Menu' + 'delete',
				text: 'Delete',
				icon: this.pathToScript+'iconContextMenu/delete.gif'
			},{
				id: this.treeId + 'Menu' + 'modify',
				text: 'Modify',
				icon: this.pathToScript+'iconContextMenu/modify.gif'
			},{
				id: this.treeId + 'Menu' + 'download',
				text: 'Download',
				icon: this.pathToScript+'iconContextMenu/download.gif'
			},{
				id: this.treeId + 'Menu' + 'share',
				text: 'Share',
				icon: this.pathToScript+'iconContextMenu/share.gif'
			},{
				id: this.treeId + 'Menu' + 'public',
				text: 'Public',
				icon: this.pathToScript+'iconContextMenu/public.gif'
			},{
				id: this.treeId + 'Menu' + 'del_public',
				text: 'Un public',
				icon: this.pathToScript+'iconContextMenu/del_public.gif'
			},{
				id: this.treeId + 'Menu' + 'favourite',
				text: 'Favourite',
				icon: this.pathToScript+'iconContextMenu/favourite.gif'
			},{
				id: this.treeId + 'Menu' + 'del_favourite',
				text: 'Un favourite',
				icon: this.pathToScript+'iconContextMenu/del_favourite.gif'
			},{
				id: this.treeId + 'Menu' + 'edit',
				text: 'Edit',
				icon: this.pathToScript+'iconContextMenu/edit.gif'
			},{
				id: this.treeId + 'Menu' + 'url',
				text: 'URL',
				icon: this.pathToScript+'iconContextMenu/url.gif'
			},{
				id: this.treeId + 'Menu' + 'email',
				text: 'Email',
				icon: this.pathToScript+'iconContextMenu/email.gif'
			},{
				id: this.treeId + 'Menu' + 'open',
				text: 'Open',
				icon: this.pathToScript+'iconContextMenu/open.gif'
			}
			],
			listeners: {
				itemclick: function(item) {
					switch( item.id.replace(thisObject.treeId + 'Menu', '') ) {
						case 'delete':
							thisObject.doDelete(1);
							break;
						case 'modify':
							thisObject.mModify();
							break;
						case 'download':
							thisObject.mDownload();
							break;
						case 'share':
							thisObject.mShare();
							break;
						case 'public':
							thisObject.doPublic(1);
							break;
						case 'del_public':
							thisObject.doPublic(0);
							break;
						case 'favourite':
							thisObject.doFavourite(1);
							break;
						case 'del_favourite':
							thisObject.doFavourite(0);
							break;
						case 'edit':
							thisObject.Edit();
							break;
						case 'url':
							thisObject.getURL();
							break;
						case 'email':
							thisObject.mEmail();
							break;
						case 'open':
							thisObject.mOpen();
							break;
					}
				}
			}
		});

		this.tree = new Ext.tree.TreePanel({
			renderTo: this.treeId,
			useArrows: false,
			autoScroll: false,
			animate: true,
			enableDD: true,
			containerScroll: true,
			border: false,
			selModel: new Ext.tree.MultiSelectionModel(),
			containerScroll: true,
			dropConfig: {appendOnly:false},

			root: this.rootNode,
			rootVisible: false,
			listeners:{
				beforeexpandnode:function(Node){
					thisObject.userTryOpenNode(Node);
				},
				contextmenu: function(node, e) {
			//          Register the context node with the menu so that a Menu Item's handler function can access
			//          it via its {@link Ext.menu.BaseItem#parentMenu parentMenu} property.
//						node.select();

//						this.menuEnable('delete', 0);
						var c = SMEStorageFM.contextMenu;
						thisObject.synchronizeMenu();
//						c.contextNode = node;
						c.showAt(e.getXY());
				},
				beforenodedrop: function( e ) {
						var elementId = e.dropNode.id;
						var folderId = e.target.id;

						var id1 = e.dropNode.id.replace(thisObject.treeId, '');
						var id2 = e.target.id.replace(thisObject.treeId, '');
						thisObject.beforeDrop(id1, id2);

						return false;
				},
				beforedblclick: function(Node) {
						var id=Node.id;
						id=id.replace(thisObject.treeId, '');
						var i=0;
						while(  (typeof(thisObject.mainTree)!="undefined") && (typeof(thisObject.mainTree[i])!="undefined")  ){
							if(  (thisObject.mainTree[i]['id']==id)  ){
								if(  thisObject.mainTree[i]['type']==0  ){
									Ext.MessageBox.confirm('Download', 'Do you want to download this file?', function(btn){
										if( btn == 'yes' ){
											thisObject.mDownload(id);
										}
									});

									return 0;
								}
								break;
							}
							i++;
						}//while
				}
			}
		});

//this.tree.contextMenu.removeAll();
//this.tree.contextMenu=this.contextMenu;

		Ext.get('mainTreeFileManager').on("mousedown", function(e) {
			if(  thisObject.brouser=='Opera'  ){
				if(  e.button==2  ){													// create context menu if right click in Opera
					thisObject.tree.fireEvent('contextmenu', thisObject.rootNode, e);
					return false;
				}
			}
		});

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.synchronizeMenu=function(){
		this.menuEnable('delete', 0);
		this.menuEnable('modify', 0);
		this.menuEnable('download', 0);
		this.menuEnable('share', 0);
		this.menuEnable('public', 0);
		this.menuEnable('del_public', 0);
		this.menuEnable('favourite', 0);
		this.menuEnable('del_favourite', 0);
		this.menuEnable('edit', 0);
		this.menuEnable('url', 0);
		this.menuEnable('email', 0);
		this.menuEnable('open', 0);

		var i=0;
		var selectFolder=0;
		var selectFile=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['node'].isSelected())  ){
				if(this.mainTree[i]["type"]==0){
					selectFile++;
				}
				if(this.mainTree[i]["type"]==1){
					selectFolder++;
				}
				if(this.mainTree[i]["type"]==5){
					return 0;
				}
			}
			i++;
		}


		if(  (selectFolder==0) && (selectFile==0)  ){
		}

		if(  (selectFolder!=0) && (selectFile!=0)  ){
			this.menuEnable('delete', 1);
//			this.menuEnable('share', 1);
		}else{
			if(  selectFolder!=0  ){
				this.menuEnable('delete', 1);
				this.menuEnable('to_clipboard', 1);
			}
			if(  selectFolder==1  ){
				this.menuEnable('modify', 1);
				this.menuEnable('share', 1);
			}
			if(  (selectFile==0) && (selectFolder==1)  ){
				this.menuEnable('share', 1);
			}

			if(  selectFile!=0  ){
				this.menuEnable('delete', 1);
				this.menuEnable('favourite', 1);
				this.menuEnable('public', 1);
				this.menuEnable('del_public', 1);
				this.menuEnable('del_favourite', 1);
				this.menuEnable('to_clipboard', 1);
			}
			if(  (selectFile==1) && (selectFolder==0)  ){
				this.menuEnable('share', 1);
			}
			if(  selectFile==1  ){
				this.menuEnable('modify', 1);
				this.menuEnable('download', 1);
				this.menuEnable('url', 1);
				this.menuEnable('email', 1);


				var i=0;
				while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
					if(  (this.mainTree[i]['node'].isSelected())  ){
						var type=this.mainTree[i]["type"];
						var ext=this.mainTree[i]["extension"];
						if(   (ext=='doc') || (ext=='xls') || (ext=='txt')
							 || (ext=='php') || (ext=='htm') || (ext=='html')
							 || (ext=='pdf')
						){
							this.menuEnable('edit', 1);
						}

						if(   (ext=='doc') || (ext=='pdf')  || (ext=='docx')
							 || (ext=='ppt') || (ext=='pptx') || (ext=='tiff')
						){
							this.menuEnable('open', 1);
						}
						break;
					}
					i++;
				}//while


			}
		}

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.menuEnable=function(id, enable){			// enable=0 - set disable, enable=1 - set enable
		if(this.contextMenu && this.contextMenu.items) {
			var b=this.treeId + 'Menu';
			this.contextMenu.items.each(function(item){
				if(  item.id.replace(b, '') == id  ){
					if(  enable == 0  ) {
						item.disable();
					}else{
						item.enable();
					}
				}
			});
		}
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.getFilesList=function(id){
		if( (typeof(id)=='undefined') || (id=='') ){
			id=0;
		}
/*
		var p=[];
		p[0]=id;						// id
		p[1]='0';						// limitlonglists
		p[2]='y';						// ignorefilter

		this.runFunction('getFilesList', p, 'Get files list<br><br>Please wait...', 'showFiles("'+ id +'");');
*/

		var start=0;
		var i=0;
		while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
			if(  this.mainTree[i]['id']==id  ){
				if(  this.mainTree[i]['type']==5  ){
					id=this.mainTree[i]['pid'];
					start=this.mainTree[i]['start'];
				}
				break;
			}
			i++;
		}

		var p=[];
		p[0]=id;								// id
		p[1]=start;							// from
		p[2]=this.countFiles;		// count

		if( id==0 ){
			p[1]='0';
			p[2]='0';
		}

		this.runFunction('getFolderContents', p, 'Get files list<br><br>Please wait...', 'showFiles("'+ id +'", "'+ p[1] +'", "'+ p[2] +'");');
	}
//------------------------------------------------------------------------------------------
	prototype.createShadowFolder=function(id, start, count, total){
		var shadowFolder=new Array();
		shadowFolder['id'] = this.countShadowFoldes+1;
		shadowFolder['id'] =  '__' + shadowFolder['id'];
		shadowFolder['pid'] = id;
		shadowFolder['type'] = 5;
		shadowFolder['start'] = 1 * start;
		var s=start+1;
		var n=start+count;
		if( n>total){
			n=total;
		}
		shadowFolder['name'] = 'Files '+ s +'-'+ n;
		this.countShadowFoldes++;

		shadowFolder['loaded'] = 0;
		shadowFolder['showed'] = 1;

		return shadowFolder;
	}
//------------------------------------------------------------------------------------------
	prototype.showFiles=function(id, start, count){
		var res=this.responseData;
		start=1 * start;
		count=1 * count;

		var total=0;
		var shadowFolder=new Array();
		if(  (typeof(res["total"])!='undefined') && (count>0) && (res["total"]>count) ){
			if(  (start==0)  ){
				total = res["total"];
				shadowFolder=this.createShadowFolder(id, start, count, total);
				this.addElementToPanel(this.treeId, shadowFolder, shadowFolder["pid"]);

				var n=start+count;
				var shadowFolders = new Array();
				var k=0;
				while( n<total ){
					shadowFolders[k]=this.createShadowFolder(id, n, count, total);

					this.addElementToPanel(this.treeId, shadowFolders[k], shadowFolders[k]["pid"]);

					n=n+count;
					k++;
				}
			}else{
				var i=0;
				while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
					if(  (this.mainTree[i]['pid']==id) && (this.mainTree[i]['type']==5) && (this.mainTree[i]['start']==start)  ){
						shadowFolder = this.mainTree[i];
						break;
					}
					i++;
				}
			}
		}

		var nFiles=new Array();
		var i=0;
		var filelist=res.filelist;
		while(  (typeof(filelist)!='undefined') && (typeof(filelist['n'+i])!='undefined')  ){
			var nFile=filelist['n'+i];

			if(  nFile['fi_pid']==''){
				nFile['fi_pid']='0';
			}

			if(nFile['fi_pid']!=id){
				i++;
				continue;
			}

			nFile['id']					=(nFile['fi_id']=='')?(0):(nFile['fi_id']);
			nFile['pid']					=(nFile['fi_pid']=='')?(0):(nFile['fi_pid']);
			nFile['real_pid']			=nFile['pid'];
			nFile['name']				=(nFile['fi_name']=='')?(''):(nFile['fi_name']);
			nFile['description']		=(nFile['fi_description']=='')?(0):(nFile['fi_description']);
			nFile['type']				=(nFile['fi_type']=='')?(0):(nFile['fi_type']);						// 0 - file, 1 - folder
			nFile['created']			=(nFile['fi_created']=='')?('0000:00:00 00:00:00'):(nFile['fi_created']);
			nFile['size']				=(nFile['fi_size']=='')?(0):(nFile['fi_size']);
			nFile['tags']				=(nFile['fi_tags']=='')?(0):(nFile['fi_tags']);
			nFile['public']				=(nFile['fi_public']=='')?(0):(nFile['fi_public']);
			nFile['encrypted']		=(nFile['fi_encrypted']=='')?(0):(nFile['fi_encrypted']);
			nFile['favorite']			=(nFile['fi_favorite']=='')?(0):(nFile['fi_favorite']);
			nFile['modified']			=(nFile['fi_modified']=='')?('0000:00:00 00:00:00'):(nFile['fi_modified']);
			nFile['lastaccessed']	=(nFile['fi_lastaccessed']=='')?('0000:00:00 00:00:00'):(nFile['fi_lastaccessed']);
			nFile['hits']					=(nFile['fi_hits']=='')?(0):(nFile['fi_hits']);
			nFile['maincode']		=nFile['fi_maincode'];
			nFile['extension']		=nFile['fi_extension'];
			nFile['provider']			=(nFile['fi_provider']=='')?(0):(nFile['fi_provider']);

			nFile['startfile']		=0;						// Only for shadow folder
			nFile['total']				=0;						// count files in folder. Only for folder

			nFile['loaded']			= 0;							// 1 - folder is loaded. Only for folder
			nFile['showed']			= 1;
//		nFile['selected']	=0;								// 0 - not selected, 1 - selected

			if(  (count>0) && (total>count)  ){
				nFile['pid']=shadowFolder['id'];
				if( start==0 ){
					nFile['showed'] = 0;
				}
			}

			if( start>0 ){
				nFile['pid']=shadowFolder['id'];
			}

			nFiles[nFiles.length]=nFile;
			i++;
		}

//		nFiles = this.sortFolder(nFiles, 1);																	// Sort folder
//		nFiles = this.sortFolder(nFiles, 0);																	// Sort files

		i=0;
		while(  i<nFiles.length  ){																			// Show folder
			if(  nFiles[i]['type']==1  ){
				this.addElementToPanel(this.treeId, nFiles[i], nFiles[i]["pid"]);
			}
			i++;
		}

		i=0;
		while(  i<nFiles.length  ){																		// Show files
			if(  nFiles[i]['type']==0  ){
				this.addElementToPanel(this.treeId, nFiles[i], nFiles[i]["pid"]);
			}
			i++;
		}

		i=0;
		while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
			if(  this.mainTree[i]["id"]==id  ){
				this.mainTree[i]['loaded']=1;
				this.mainTree[i]['total']=total;
				break;
			}
			i++;
		}

	}
//------------------------------------------------------------------------------------------
	prototype.addElementToPanel=function(treeId, element, folderId){
		var pNode;
		var leaf;
		var i=0;
		if( folderId!=0 ){
			while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
				if(  this.mainTree[i]["id"]==folderId  ){
					pNode = this.mainTree[i]['node'];
					break;
				}
				i++;
			}
		}else{
			pNode=this.rootNode;
		}

		if(  typeof(pNode)=='undefined'  ){
			return -1;
		}


		if(  element['type']==0  ){
			leaf=true;
		}else{
			leaf=false;
		}

		var icon=this.getIcon(element['extension']);
		this.mainTree[this.mainTree.length]=element;
		if(  element['type']==0  ){
			this.mainTree[this.mainTree.length-1]['node'] = new Ext.tree.AsyncTreeNode({
				text: element['name'],
				id: treeId + element['id'],
				leaf: leaf,
				icon: icon,
				children: []
			});
		}

		if(  element['type']==1  ){
			this.mainTree[this.mainTree.length-1]['node'] = new Ext.tree.AsyncTreeNode({
				text: element['name'],
				id: treeId + element['id'],
				leaf: leaf,
				children: []
			});
		}

		if(  element['type']==5  ){			// shadow folder
			this.mainTree[this.mainTree.length-1]['node'] = new Ext.tree.AsyncTreeNode({
				text: element['name'],
				id: treeId + element['id'],
				leaf: leaf,
				children: []
			});
		}

		pNode.appendChild(this.mainTree[this.mainTree.length-1]['node']);

	}
//------------------------------------------------------------------------------------------
	prototype.deleteElementFromPanel=function(treeId, id, notDelFromArray){
		var i=0;
		if( id!=0 ){
			while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
				if(  this.mainTree[i]["id"]==id  ){
					this.mainTree[i]['node'].remove();
					if(  (typeof(notDelFromArray)!='undefined') && (notDelFromArray==1)  ){
						this.mainTree[i]['node']='';
					}else{
						this.mainTree[i]=this.mainTree[this.mainTree.length-1];
						this.mainTree.length--;
					}
					break;
				}
				i++;
			}
		}
	}
//------------------------------------------------------------------------------------------
	prototype.clearPanel=function(treeId){
		var i=0;
		while(  (typeof(this.mainTree)!='undefined') && (typeof(this.mainTree[i])!='undefined')  ){
			this.mainTree[i]['node'].remove();
			i++;
		}

		this.mainTree=new Array();

	}
//------------------------------------------------------------------------------------------
	prototype.sortFolder=function(nFiles, type){				// type=0 - files, type=1 - folders, type=2 - groups, type=0 - users
		var i=0;
		var L=0;
		while(  (i<nFiles.length) && (L==0)  ){													// Sort folder
			var j=1;
			L=1;
			while(  j<nFiles.length  ){
				if(  (nFiles[j]['type']!=type) || (nFiles[j-1]['type']!=type)  ){
					j++;
					continue;
				}

				var k=0;
				while(  (k<nFiles[j]['name'].length) && (k<nFiles[j-1]['name'].length)
								&& (nFiles[j]['name'].charAt(k) ==  nFiles[j-1]['name'].charAt(k))  ){
					k++;
				}

				if(  nFiles[j]['name'].charAt(k)<nFiles[j-1]['name'].charAt(k)  ){
					var xx=nFiles[j];
					nFiles[j]=nFiles[j-1];
					nFiles[j-1]=xx;
					L=0;
				}
				j++;
			}
			i++;
		}
		return nFiles;
	}
	//==========================================================================================
	prototype.signIn=function(mask){
		if(  (typeof(this.userInfo['login'])=='undefined') || (typeof(this.userInfo['password'])=='undefined')  ){
			Ext.Msg.alert('Error', 'Login or password not found.');

			if(  timerID>0  ){
				clearInterval(timerID);
				timerID='';
			}
			return -2;
		}

		var msg='';
		if(  (typeof(mask)!='undefined') && (mask==1)  ){
			msg='Get token<br><br>Please wait...';
		}

		var p=[];
		p[0]=this.userInfo['login'];
		p[1]=this.userInfo['password'];

//		this.userInfo['token']= '*';
		this.runFunction('gettoken', p, msg, 'signInResp()');
	}
//------------------------------------------------------------------------------------------
	prototype.signInResp=function(){
		this.waitResult=0;
		res=this.responseData;
		if(  typeof(res['token'])=="undefined"  ){
			Ext.Msg.alert('Error', 'Unable to retrieve access token. Please check your username and password are correct and retry.');
			if(  this.timerID>0  ){
				clearInterval(this.timerID);
				this.timerID='';
			}
			return 0;
		}

		this.userInfo['token']					= res['token'];
		this.userInfo['autologincode']	= res['autologincode'];
		this.userInfo['userid']					= res['userid'];
	}
//------------------------------------------------------------------------------------------
	prototype.doPublic=function(setValue){
		if(  (typeof(setValue)=="undefined") || (setValue<0)  ){
			setValue=1;
		}

		var L=0;
		var i=0;
		var id='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// Get id selected files
			if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==0)  ){
				if( L==0 ){
					id = this.mainTree[i]["id"];
					L++;
				}else{
					id += ',' + this.mainTree[i]["id"];
				}
			}
			i++;
		}

		if( id.length<1 ){
			var mess1=(setValue==1)?(''):(' not');
			Ext.Msg.alert('Error', 'Choose file(s), what you want to do'+ mess1 +' public');
			return -1;
		}

		var p=[];
		p[0]=id;
		p[1]=setValue;

		var mess2=(setValue==1)?('Do Public'):('Do Un Public');
		this.runFunction('doPublicFile', p, mess2 + '<br><br>Please wait...', 'doPublicResp("'+ setValue +'");');
	}
//------------------------------------------------------------------------------------------
	prototype.doPublicResp=function(setValue){
		if(  (typeof(setValue)=="undefined") || (setValue<0)  ){
			setValue=1;
		}

		var i=0;
		var id='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// Get id selected files
			if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==0)  ){
				this.mainTree[i]["public"] = setValue;
			}
			i++;
		}

//		var mess=(setValue==0)?('Do Public'):('Do Un Public');
	}
//------------------------------------------------------------------------------------------
	prototype.doFavourite=function(setValue){
		if(  (typeof(setValue)=="undefined") || (setValue<0)  ){
			setValue=1;
		}

		var L=0;
		var i=0;
		var id='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// Get id selected files
			if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==0)  ){
				if( L==0 ){
					id = this.mainTree[i]["id"];
					L++;
				}else{
					id += ',' + this.mainTree[i]["id"];
				}
			}
			i++;
		}

		if( id.length<1 ){
			var mess1=(setValue==1)?(''):(' not');
			Ext.Msg.alert('Error', 'Choose file(s), what you want to do'+ mess1 +' favourite');
			return -1;
		}

		var p=[];
		p[0]=id;
		p[1]=setValue;

		var mess2=(setValue==1)?('Do Favourite'):('Do Un Favourite');
		this.runFunction('doFavouriteFile', p, mess2 + '<br><br>Please wait...', 'doFavouriteResp("'+ setValue +'");');
	}
//------------------------------------------------------------------------------------------
	prototype.doFavouriteResp=function(setValue){
		if(  (typeof(setValue)=="undefined") || (setValue<0)  ){
			setValue=1;
		}

		var i=0;
		var id='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// Get id selected files
			if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==0)  ){
				this.mainTree[i]["favourite"] = setValue;
			}
			i++;
		}

//		var mess=(setValue==1)?('Do Favourite'):('Do Un Favourite');
	}
//------------------------------------------------------------------------------------------
	prototype.doDelete=function(showConfirm){
		if(  (typeof(showConfirm)!="undefined") && (showConfirm==1)  ){
			var i=0;
			var L=0;
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (this.mainTree[i]['node'].isSelected())  ){
					L=1;
					break;
				}
				i++;
			}

			if(  L==0  ){
				Ext.Msg.alert('Error', 'Choose file(s) or folder(s), what you want to delete');
				return -2;
			}

			var thisObject=this;
			Ext.MessageBox.confirm('Delete', 'Do you want to delete?', function(btn){
				if (btn == 'yes') {
					thisObject.doDelete();
				}
			});

			return 0;
		}

		var f='';
		var mess='';

		var L=0;
		var i=0;
		var id='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// Get id selected files
			if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==0)  ){
				if( L==0 ){
					id = this.mainTree[i]["id"];
					L++;
				}else{
					id += ',' + this.mainTree[i]["id"];
				}
			}
			i++;
		}

		if( id.length<1 ){										// files are not selected
			var i=0;
			var id='';
			var name='';
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// Get id selected folder
				if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==1)  ){
					id = this.mainTree[i]["id"];
					name = this.mainTree[i]["name"];
					break;
				}
				i++;
			}

			f = 'doDeleteFolder';
			mess='Delete &nbsp; '+ name;
		}else{
			f = 'doDeleteFile';
			mess='Delete selected file(s)';
		}

		if( id.length<1 ){										// folders are not selected
			return 0;
		}

		var p=[];
		p[0]=id;

		this.runFunction(f, p, mess + '<br><br>Please wait...', 'doDeleteResp();');
	}
//------------------------------------------------------------------------------------------
	prototype.doDeleteResp=function(){
		var L=0;
		var i=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// delete selected files
			if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==0)  ){
				this.deleteElementFromPanel(this.treeId, this.mainTree[i]["id"]);
				L=1;
				continue;
			}
			i++;
		}

		if( L==0 ){										// files are not deleted
			var i=0;
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){			// deleted selected folder
				if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]["type"]==1)  ){
					this.deleteElementFromPanel(this.treeId, this.mainTree[i]["id"]);
					L=2;
					break;
				}
				i++;
			}

		}

		if( L!=0 ){										// not all folders are removed
			this.doDelete();
			return 0;
		}

//		var mess=(setValue==1)?('Do Favourite'):('Do Un Favourite');
	}
//------------------------------------------------------------------------------------------
	prototype.mModify=function(){
		var i=0;
		var L=0;
		var c=0;
		var folder='';
		var name='';
		var description='';
		var tags='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['node'].isSelected())  ){
				folder=this.mainTree[i]['type'];
				name=this.mainTree[i]['name'];
				description=this.mainTree[i]['description'];
				tags=this.mainTree[i]['tags'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file or folder, what you want to modify');
			return -2;
		}

		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file or folder');
			return -2;
		}


		var html='';
		var handler;
		var caption='Modify ';
		if(  folder==1  ){
			handler = function(){
				SMEStorageFM.ModifyFolder();
				SMEStorageFM.modalbox.hide();
			}

			caption+='folder';
		}else{
			handler = function(){
				SMEStorageFM.ModifyFile();
				SMEStorageFM.modalbox.hide();
			}

			caption+='file';
		}

		handler = function(){
			if( SMEStorageFM.doModify() != -1 ){
				SMEStorageFM.modalbox.hide();
			}
		}

		var html_header = '<div class="x-window-header">'+ caption +'</div>';

		html+= '<table border="0" cellpadding="3" cellspacing="7" align="center" class="SMEStorageFMModalbox">';
		html+= '	<tr>';
		html+= '		<td>Name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" id="ModifyFile_fileName" size="40" class="SMEStorageFMModalbox"></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>Description: &nbsp;</td>';
		html+= '		<td><input type="text" value="'+ description +'" id="ModifyFile_description" size="40" class="SMEStorageFMModalbox"></td>';
		html+= '	</tr>';

		if(  folder==0  ){
			html+= '	<tr>';
			html+= '		<td>Tags: &nbsp;</td>';
			html+= '		<td><input type="text" value="'+ tags +'" id="ModifyFile_tags" size="40" class="SMEStorageFMModalbox"></td>';
			html+= '	</tr>';
		}

		html+= '</table>';

		document.getElementById('SMEStorageFMModalbox').innerHTML = html_header;

		var win = new Ext.Window({
			applyTo:'SMEStorageFMModalbox',
			layout:'fit',
			x:0,
			y:0,

			width:350,
			height:175,
			closeAction:'hide',
			plain: true,
			modal: true,

			items: [{
				html: html
			}],

			buttons: [{
				text:'Modify',
				handler: handler
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageFM.modalbox.hide();
				}
			}]
		});

		win.show(this);

		SMEStorageFM.modalbox=win;
	}
//------------------------------------------------------------------------------------------
	prototype.doModify=function(id, name, description, tags, folder){
		var i=0;
		var L=0;

		if(  (typeof(id)=="undefined") || (id.length<1)  ){
			folder='';
			id='';
			name='';
			description='';
			tags='';
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (this.mainTree[i]['node'].isSelected())  ){
					folder=this.mainTree[i]['type'];
					id=this.mainTree[i]['id'];
					break;
				}
				i++;
			}

			name				= document.getElementById('ModifyFile_fileName').value;
			description	= document.getElementById('ModifyFile_description').value;
			if( folder==0 ){
				tags			= document.getElementById('ModifyFile_tags').value;
			}
			if(  name.length<1  ){
				Ext.Msg.alert('Error', 'Enter name');
				return -1;
			}
		}

		var f='';
		var p=[];
		var mess='';

		if( folder==1 ){
			f='doRenameFolder';
			p[0]=id;
			p[1]=name;
			p[2]=description;
			mess='folder';
		}else{
			f='doRenameFile';
			p[0]=id;
			p[1]=name;
			p[2]=description;
			p[3]=tags;
			mess='file';
		}

		this.runFunction(f, p, 'Modify '+ mess + '<br><br>Please wait...', 'doModifyResp("'+ id +'", "'+ name +'", "'+ description +'", "'+ tags +'");');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.doModifyResp=function(id, name, description, tags){
		var i=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['id']==id)  ){
				this.mainTree[i]["node"].setText(name);
				this.mainTree[i]["name"] = name;
				this.mainTree[i]["description"] = description;
				if(this.mainTree[i]["type"]==0){
					this.mainTree[i]["tags"] = tags;
				}
				break;
			}
			i++;
		}

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.mDownload=function(id){

		var i=0;
		var L=0;
		var c=0;
		var folder='';
		var name='';
		var encrypted='';
		var maincode='';
		var extension='';
		if(  (typeof(id)!="undefined") && (id.length>0)  ){
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (this.mainTree[i]['id']==id)  ){
					id					=this.mainTree[i]['id'];
					folder			=this.mainTree[i]['type'];
					name				=this.mainTree[i]['name'];
					encrypted		=this.mainTree[i]['encrypted'];
					maincode		=this.mainTree[i]['maincode'];
					extension		=this.mainTree[i]['extension'];
					c++;
				}
				i++;
			}
		}else{
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (this.mainTree[i]['node'].isSelected())  ){
					id					=this.mainTree[i]['id'];
					folder			=this.mainTree[i]['type'];
					name				=this.mainTree[i]['name'];
					encrypted		=this.mainTree[i]['encrypted'];
					maincode		=this.mainTree[i]['maincode'];
					extension		=this.mainTree[i]['extension'];
					c++;
				}
				i++;
			}
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file, what you want to download');
			return -2;
		}

		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file');
			return -2;
		}

		if(  folder==1  ){
			Ext.Msg.alert('Error', ' &nbsp; &nbsp; Choose <b>file</b> &nbsp; &nbsp; ');
			return -3;
		}

		if(  encrypted==0  ){
//			var furl=this.server_sme + '/files/' + maincode + '.' + extension;
			var p=[];
			p[0]=this.encode64(''+id);
			p[1]='';

			var furl=this.server_sme +'/api/'+ 	this.userInfo['token'] + '/getFile/' + p[0] + ',' + p[1];

			window.open(furl);
			return 0;
		}

		// File is encrypted. Show modalbox for, to take a password

		var html='';
		var handler;
		var caption='Download encrypted file';

		handler = function(){
			SMEStorageFM.doDownload();
		}

		var html_header = '<div class="x-window-header">'+ caption +'</div>';

		html+= '<table border="0" cellpadding="3" cellspacing="7" align="center" class="SMEStorageFMModalbox">';
		html+= '	<tr>';
		html+= '		<td>Name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" size="30" class="SMEStorageFMModalbox" disabled></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>Encryption phrase: &nbsp;</td>';
		html+= '		<td><input type="text" value="" id="DownloadEncrypted_phrase" size="30" class="SMEStorageFMModalbox"></td>';
		html+= '	</tr>';
		html+= '</table>';

		document.getElementById('SMEStorageFMModalbox').innerHTML = html_header;

		var win = new Ext.Window({
			applyTo:'SMEStorageFMModalbox',
			layout:'fit',
			x:0,
			y:0,

			width:350,
			height:150,
			closeAction:'hide',
			plain: true,
			modal: true,

			items: [{
				html: html
			}],

			buttons: [{
				text:'Download',
				handler: handler
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageFM.modalbox.hide();
				}
			}]
		});

		win.show(this);

		SMEStorageFM.modalbox=win;
	}
//------------------------------------------------------------------------------------------
	prototype.doDownload=function(id, pass){
		var i=0;
		var L=0;

		if(  (typeof(id)=="undefined") || (id.length<1)  ){
			id='';
			pass='';
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (this.mainTree[i]['node'].isSelected())  ){
					id=this.mainTree[i]['id'];
					break;
				}
				i++;
			}

			pass = document.getElementById('DownloadEncrypted_phrase').value;
			if(  pass.length<1  ){
				Ext.Msg.alert('Error', 'Enter encryption phrase');
				return -1;
			}
		}

		var p=[];
		p[0]=id;
		p[1]=pass;

		SMEStorageFM.modalbox.hide();

		this.runFunction('doCheckEncryptionPhrase', p, 'Do check encryption phrase<br><br>Please wait...', 'doDownloadResp("'+ id +'", "'+ pass +'");');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.doDownloadResp=function(id, pass){
		res=this.responseData;

		if(  (typeof(res['checkresult'])=="undefined") || (res['checkresult']!=0) || (res['checkresult']=='')  ){
			this.modalbox.show(this);
			Ext.Msg.alert('Error', 'Not correct encryption phrase');
			return -1;
		}

		var p=[];
		p[0]=this.encode64(''+id);
		p[1]=this.encode64(''+pass);

		var furl=this.server_sme +'/api/'+ 	this.userInfo['token'] + '/getFile/' + p[0] + ',' + p[1];
		window.open(furl);

		this.modalbox.hide();

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.Edit=function(){
		var i=0;
		var c=0;
		var folder='';
		var id='';
		var maincode='';
		var extension='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['node'].isSelected())  ){
				id					=this.mainTree[i]['id'];
				folder			=this.mainTree[i]['type'];
				maincode		=this.mainTree[i]['maincode'];
				extension		=this.mainTree[i]['extension'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file, what you want to edit');
			return -2;
		}

		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file');
			return -2;
		}

		if(  folder==1  ){
			Ext.Msg.alert('Error', ' &nbsp; &nbsp; Choose <b>file</b> &nbsp; &nbsp; ');
			return -3;
		}

		var L=0;
		var url;
		if(  (extension=='doc') || (extension=='xls') ){
			url= this.server_sme + "/index.php?p=zoho&action=opendocument&id="+ id +"&autologin=" + this.userInfo['autologincode'];
			L=1;
		}

		if(  (extension=='txt') || (extension=='php') || (extension=='htm') || (extension=='html')  ){
			url= this.server_sme + "/index.php?p=wysiwyg&fi_id="+ id +"&type=empty2&editor=editarea&autologin=" + this.userInfo['autologincode'];
			L=1;
		}

		if(  (extension=='pdf')  ){
			url= this.server_sme + "/?p=scribdviewer&type=main_lite#" + this.server_sme +'/files/'+ maincode +'.'+ extension;
			L=1;
		}

		if(  L==1 ){
			window.open(url);
		}

	}
//------------------------------------------------------------------------------------------
	prototype.getURL=function(){
		var i=0;
		var id='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['node'].isSelected()) && (this.mainTree[i]['type']==0)  ){
				id=this.mainTree[i]['id'];
				break;
			}
			i++;
		}

		if(  id.length<1  ){
			Ext.Msg.alert('Error', 'Choose <b>file</b>');
			return -1;
		}

		var p=[];
		p[0]=id;

		this.runFunction('getFileTinyURL', p, 'Get URL <br><br>Please wait...', 'getURLResp();');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.getURLResp=function(){
		var i=0;
		var name='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['node'].isSelected())  ){
				name=this.mainTree[i]['name'];
				break;
			}
			i++;
		}

		var res=this.responseData;
		if(  (typeof(res['url'])=="undefined") || (typeof(res['tinyurl'])=="undefined")  ){
			Ext.Msg.alert('Error', 'URL not get');
			return -1;
		}

		var url =res['url'];
		var turl=res['tinyurl'];

		var html='';
		var caption='Get URL';
		var html_header = '<div class="x-window-header">'+ caption +'</div>';

		html+= '<table border="0" cellpadding="3" cellspacing="7" align="center" class="SMEStorageFMModalbox">';
		html+= '	<tr>';
		html+= '		<td>Name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" size="50" class="SMEStorageFMModalbox" disabled></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>URL: &nbsp;</td>';
		html+= '		<td><input type="text" value="'+ url +'" size="50" class="SMEStorageFMModalbox"></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>Short URL: &nbsp;</td>';
		html+= '		<td><input type="text" value="'+ turl +'" size="50" class="SMEStorageFMModalbox"></td>';
		html+= '	</tr>';
		html+= '</table>';

		document.getElementById('SMEStorageFMModalbox').innerHTML = html_header;

		var win = new Ext.Window({
			applyTo:'SMEStorageFMModalbox',
			layout:'fit',
			x:0,
			y:0,

			width:400,
			height:175,
			closeAction:'hide',
			plain: true,
			modal: true,

			items: [{
				html: html
			}],

			buttons: [{
				text:'OK',
				handler: function(){
					SMEStorageFM.modalbox.hide();
				}
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageFM.modalbox.hide();
				}
			}]
		});

		win.show(this);

		SMEStorageFM.modalbox=win;
	}
//------------------------------------------------------------------------------------------
	prototype.mShare=function(){
		var i=0;
		var L=0;
		var c=0;
		var folder='';
		var name='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['node'].isSelected())  ){
				folder=this.mainTree[i]['type'];
				name=this.mainTree[i]['name'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file or folder, what you want to share');
			return -2;
		}

		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file or folder');
			return -2;
		}

		if(this.groupTree!=0){
			this.showShareWindow(name, folder);
			return 0;
		}

		var p=[];
		p[0]='';

		this.runFunction('getGroupsList', p, 'Get group list <br><br>Please wait...', 'mShareResp();');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.mShareResp=function(){
		var res=this.responseData;

		this.groupTree=new Array();

		var i=0;
		var grouplist=res.grouplist;
		while(  (typeof(grouplist)!='undefined') && (typeof(grouplist['n'+i])!='undefined')  ){
			var nGroup=grouplist['n'+i];

			if(  nGroup['fi_pid']==''){
				nGroup['fi_pid']='0';
			}

			nGroup['id']						=(nGroup['gr_id']=='')?(0):(nGroup['gr_id']);
			nGroup['real_id']				=nGroup['id'];
			nGroup['pid']						=0;
			nGroup['real_pid']			=nGroup['pid'];
			nGroup['type']					=2;																					// 2 - group
			nGroup['name']					=(nGroup['gr_title']=='')?(''):(nGroup['gr_title']);
			nGroup['description']		=(nGroup['gr_description'].search('HASH')==0)?(''):(nGroup['gr_description']);
			nGroup['permissions']		=(nGroup['gr_permissions']=='')?(0):(nGroup['gr_permissions']);
			nGroup['private']				=(nGroup['gr_private']=='')?(''):(nGroup['gr_private']);
			nGroup['creator']				=(nGroup['gr_creator']=='')?(0):(nGroup['gr_creator']);

			var users=nGroup['gr_users'];															// Add users
			var j0=0;
			while(  (typeof(users)!='undefined') && (typeof(users['n'+j0])!='undefined')  ){
				var nUser=users['n'+j0];
				nUser['id']						=(nUser['us_id']=='')?(0):(nUser['us_id']);
				nUser['real_id']			=nUser['id'];
				nUser['pid']					=nGroup['id'];
				nUser['real_pid']			=nGroup['real_pid'];
				nUser['type']					=3;																					// 3 - user
				nUser['name']					=(nUser['us_name']=='')?(''):(nUser['us_name']);
				nUser['permissions']	=(nUser['us_permissions']=='')?(0):(nUser['us_permissions']);

				nUser['id'] = nGroup['id'] +'_'+ nUser['id'];

				this.groupTree[this.groupTree.length]=nUser;
				j0++;
			}

			nGroup['gr_users']='';
			this.groupTree[this.groupTree.length]=nGroup;
			i++;
		}

//		this.groupTree = this.sortFolder(this.groupTree, 2);																	// Sort groups
//		this.groupTree = this.sortFolder(this.groupTree, 3);																	// Sort users
		this.mShare();
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.showShareWindow=function(name, folder){
		var html='';
		var caption='Share file';
		var html_header = '<div class="x-window-header">'+ caption +'</div>';

		html+= '<table border="0" cellpadding="0" cellspacing="2" align="center" class="SMEStorageFMModalbox">';
		html+= '	<tr>';
		html+= '		<td>Name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" id="ShareFolder_fileName" size="50" class="SMEStorageFMModalbox" disabled></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td colspan="2" style="padding-top:6">Select Business Group or User:</td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td colspan="2" height="150"><div style="width:99%; height:100%; overflow:auto; border:solid; border-color:#999900" id="ShareFolder_GroupTree"></div></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td colspan="2" style="padding-top:6">Comment:</td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td colspan="2"><textarea id="ShareFolder_comment" style="width:99%; height:50;"></textarea></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td colspan="2">Count of days (if 0 or empty then unlimited in time): <input type="text" value="0" id="ShareFolder_countDays" size="5" maxlength="5"></td>';
		html+= '	</tr>';

		if(  folder==1  ){
			html+= '	<tr>';
			html+= '		<td colspan="2" style="padding-top:6"><label id="ShareFolder_subdir_show"><input type="checkbox" value="0" id="ShareFolder_subdir"> Include subdirectories</label></td>';
			html+= '	</tr>';
		}

		html+= '</table>';

		document.getElementById('SMEStorageFMModalbox').innerHTML = html_header;

		var win = new Ext.Window({
			applyTo:'SMEStorageFMModalbox',
			layout:'fit',
			x:0,
			y:0,
			width:380,
			height:405,
			closeAction:'hide',
			plain: true,
			modal: true,

			items: [{
				html: html
			}],

			buttons: [{
				text:'Share',
				handler: function(){
					SMEStorageFM.doShare();
				}
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageFM.modalbox.hide();
				}
			}]
		});

		win.show(this);

		SMEStorageFM.modalbox=win;

		var rootNode = new Ext.tree.AsyncTreeNode({
			expanded: false,
			leaf: false,
			children: []
		});

		this.treeGr = new Ext.tree.TreePanel({
			renderTo: 'ShareFolder_GroupTree',
			useArrows: false,
			autoScroll: false,
			animate: false,
			enableDD: false,
			containerScroll: true,
			border: false,
			containerScroll: true,
			root: rootNode,
			rootVisible: false
		});


		var i=0;
		while(  (typeof(this.groupTree)!="undefined") && (typeof(this.groupTree[i])!="undefined")  ){							// show groups
			if(  this.groupTree[i]['type']==2  ){
				var icon = this.getIcon('%group');
				this.groupTree[i]['node'] = new Ext.tree.AsyncTreeNode({
					text: this.groupTree[i]['name'],
					id: 'ShareFolder_GroupTree' + this.groupTree[i]['id'],
					leaf: false,
					expanded: true,
					draggable: false,
					allowDomMove: false,
					icon: icon,
					children: []
				});

				rootNode.appendChild(this.groupTree[i]['node']);
			}
			i++;
		}

		i=0;
		while(  (typeof(this.groupTree)!="undefined") && (typeof(this.groupTree[i])!="undefined")  ){							// show users
			if(  (this.groupTree[i]['type']==3)  ){
				//  && (this.groupTree[i]["real_id"]!=this.userInfo['userid'])
				var icon = this.getIcon('%user');
				this.groupTree[i]['node'] = new Ext.tree.AsyncTreeNode({
					text: this.groupTree[i]['name'],
					id: 'ShareFolder_GroupTree' + this.groupTree[i]['id'],
					draggable: false,
					icon: icon,
					leaf: true,
					children: []
				});

				var pNode='';
				j=0;
				while(  (typeof(this.groupTree)!="undefined") && (typeof(this.groupTree[j])!="undefined")  ){
					if(  this.groupTree[j]['id']==this.groupTree[i]['pid']  ){
						pNode=this.groupTree[j]['node'];
						break;
					}
					j++;
				}

				pNode.appendChild(this.groupTree[i]['node']);
			}
			i++;
		}

	}
//------------------------------------------------------------------------------------------
	prototype.doShare=function(fid, gid, uid, comment, countDays, subdir, folder){
		var i=0;
		var L=0;
		if(  (typeof(fid)=="undefined") || (fid.length<1)  ){
			folder='';
			fid='';
			gid='';
			uid='';
			comment='';
			countDays='';
			subdir='';
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (this.mainTree[i]['node'].isSelected())  ){
					folder=this.mainTree[i]['type'];
					fid=this.mainTree[i]['id'];
					break;
				}
				i++;
			}

			comment		= document.getElementById('ShareFolder_comment').value;
			countDays	= document.getElementById('ShareFolder_countDays').value;

			if( folder==1 ){
				if(  document.getElementById("ShareFolder_subdir").checked==true  ){
					subdir='y';
				}else{
					subdir='n';
				}
			}

			if( isNaN(countDays) ){
				Ext.Msg.alert('Error', 'Count of days must be number or empty');
				return -1;
			}

			gid=-1;
			uid=-1;
			var i=0;
			while(  (typeof(this.groupTree)!="undefined") && (typeof(this.groupTree[i])!="undefined")  ){			// Get grup id and user id
				if( this.groupTree[i]['node'].isSelected() ){
					if( this.groupTree[i]["type"]==2 ){
						gid=this.groupTree[i]["id"];
					}else{
						gid=this.groupTree[i]["pid"];
						uid=this.groupTree[i]["id"];
						uid=uid.replace(gid+'_', '');
					}

					break;
				}
				i++;
			}

			if( gid==-1 ){
				Ext.Msg.alert('Error', "Select group or user");
				return 0;
			}

			var i=0;
			while(  (typeof(this.groupTree)!="undefined") && (typeof(this.groupTree[i])!="undefined")  ){
				if( this.groupTree[i]["id"]==gid ){
					if(  (typeof(this.groupTree[i]['permissions'])!="undefined") && (typeof(this.groupTree[i]['creator'])!="undefined") && (this.groupTree[i]['permissions']==1) && (this.groupTree[i]['creator']!=userid)  ){
						Ext.Msg.alert('Error', 'You can not post to this group. Disabled by the group creator.');
						return 0;
					}
					break;
				}
				i++;
			}

		}

		var mass='';
		var res='';
		var f;
		var p=[];

		if( folder==1 ){
			mass='Directory';
			p[0]=gid;
			p[1]=fid;
			p[2]=countDays;
			p[3]=comment;
			p[4]=uid;
			p[5]=subdir;

			f="doShareFolderWithGroup";
		}else{
			mass='File';
			p[0]=gid;
			p[1]=fid;
			p[2]=countDays;
			p[3]=comment;
			p[4]=uid;

			f='doShareFileWithGroup';
		}

		this.modalbox.hide();
		this.runFunction(f, p, 'Do share '+ mass +'<br><br>Please wait...', 'doShareResp("'+ folder +'");');

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.doShareResp=function(folder){
		var mass;
		if( folder==1 ){
			mass='Directory';
		}else{
			mass='File';
		}

		Ext.Msg.alert('Success', mass +' is shared');

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.getIcon=function(ext){
		var img=this.pathToFileIcons + 'file.gif';
		if(  typeof(ext)=="undefined"  ){
			return img;
		}

		img=this.pathToFileIcons;
		switch ( typeof(ext) ) {
			case 'zip' :
				img+='zip.gif';
				break;
			case 'rar' :
				img+='rar.gif';
				break;
			case 'jpg' :
				img+='jpg.gif';
				break;
			case 'jpeg' :
				img+='jpg.gif';
				break;
			case 'jpe' :
				img+='jpg.gif';
				break;
			case 'bmp' :
				img+='jpg.gif';
				break;
			case 'tiff' :
				img+='jpg.gif';
				break;
			case 'gif' :
				img+='jpg.gif';
				break;
			case 'png' :
				img+='jpg.gif';
				break;
			case 'psd' :
				img+='jpg.gif';
				break;
			case 'tga' :
				img+='jpg.gif';
				break;
			case 'txt' :
				img+='txt.gif';
				break;
			case 'doc' :
				img+='doc.gif';
				break;
			case 'htm' :
				img+='htm.gif';
				break;
			case 'html' :
				img+='htm.gif';
				break;
			case 'js' :
				img+='txt.gif';
				break;
			case 'avi' :
				img+='avi.gif';
				break;
			case 'mpg' :
				img+='mpg.gif';
				break;
			case 'mp3' :
				img+='mp3.gif';
				break;
			case 'wav' :
				img+='wav.gif';
				break;
			case 'exe' :
				img+='exe.gif';
				break;
			case 'pdf' :
				img+='pdf.gif';
				break;

			case '%group' :
				img+='group.gif';
				break;
			case '%user' :
				img+='user.gif';
				break;

			default :
				img=this.pathToFileIcons + 'file.gif';
		}

		return img;
	}
//------------------------------------------------------------------------------------------
	prototype.mOpen=function(){
		var i=0;
		var c=0;
		var folder='';
		var id='';
		var maincode='';
		var extension='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['node'].isSelected())  ){
				id					=this.mainTree[i]['id'];
				folder			=this.mainTree[i]['type'];
				maincode		=this.mainTree[i]['maincode'];
				extension		=this.mainTree[i]['extension'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file, what you want to open');
			return -2;
		}

		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file');
			return -2;
		}

		if(  folder==1  ){
			Ext.Msg.alert('Error', ' &nbsp; &nbsp; Choose <b>file</b> &nbsp; &nbsp; ');
			return -3;
		}

		var L=0;
		var url;
		if(  (extension=='pdf') || (extension=='doc') || (extension=='docx') || (extension=='ppt') || (extension=='pptx') || (extension=='tiff')  ){
			url= 'http://docs.google.com/viewer?url=' + encodeURIComponent(this.server_sme + '/files/' + maincode + '.' + extension);
			L=1;
		}

		if(  L==1 ){
			window.open(url);
		}

	}
//------------------------------------------------------------------------------------------
	prototype.mEmail=function(){
		var i=0;
		var L=0;
		var c=0;
		var folder='';
		var name='';
		var description='';
		var tags='';
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if(  (this.mainTree[i]['node'].isSelected())  ){
				folder=this.mainTree[i]['type'];
				name=this.mainTree[i]['name'];
				description=this.mainTree[i]['description'];
				tags=this.mainTree[i]['tags'];
				c++;
			}
			i++;
		}

		if(  c==0  ){
			Ext.Msg.alert('Error', 'Choose file or folder, what you want to modify');
			return -2;
		}

		if(  c>1  ){
			Ext.Msg.alert('Error', 'Choose only one file or folder');
			return -2;
		}

		if(  folder==1  ){
			Ext.Msg.alert('Error', ' &nbsp; &nbsp; Choose <b>file</b> &nbsp; &nbsp; ');
			return -3;
		}

		var html='';
		var handler;
		var caption='Send a file on email';
		var html_header = '<div class="x-window-header">'+ caption +'</div>';

		html+= '<table border="0" cellpadding="3" cellspacing="5" align="center" class="SMEStorageFMModalbox">';
		html+= '	<tr>';
		html+= '		<td>File name: </td>';
		html+= '		<td><input type="text" value="'+ name +'" id="Email_fileName" size="40" disabled class="SMEStorageFMModalbox"></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>Email: &nbsp;</td>';
		html+= '		<td><input type="text" value="" id="Email_email" size="40" class="SMEStorageFMModalbox"></td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td>From name: &nbsp;</td>';
		html+= '		<td><input type="text" value="" id="Email_name" size="40" class="SMEStorageFMModalbox"></td>';
		html+= '	</tr>';
		html+= '	<t>';
		html+= '		<td colspan="2">Message: &nbsp;</td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td colspan="2"><textarea id="Email_message" style="width:99%; height:125;" class="SMEStorageFMModalbox"></textarea></td>';
		html+= '	</tr>';
		html+= '</table>';

		document.getElementById('SMEStorageFMModalbox').innerHTML = html_header;

		var win = new Ext.Window({
			applyTo:'SMEStorageFMModalbox',
			x:0,
			y:0,
			layout:'fit',
			width:350,
			height:305,
			closeAction:'hide',
			plain: true,
			modal: true,

			items: [{
				html: html
			}],

			buttons: [{
				text:'Send',
				handler: function(){
					SMEStorageFM.doEmail();
				}
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageFM.modalbox.hide();
				}
			}]
		});

		win.show(this);

		SMEStorageFM.modalbox=win;
	}
//------------------------------------------------------------------------------------------
	prototype.doEmail=function(id, email, name, message){
		var i=0;
		var L=0;
		if(  (typeof(id)=="undefined") || (id.length<1)  ){
			id='';
			email = document.getElementById("Email_email").value;
			name = document.getElementById("Email_name").value;
			message = document.getElementById("Email_message").value;
			message=message.replace(/\r\n|\r|\n/g,'<br>');

			if( email.length<1 ){
				Ext.Msg.alert('Error', 'Enter email');
				document.getElementById("Email_email").focus();
				return 0;
			}

			if( email.indexOf('@')==-1 ){
				Ext.Msg.alert('Error', 'Not correct email');
				document.getElementById("Email_email").focus();
				return 0;
			}

			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if(  (this.mainTree[i]['node'].isSelected())  ){
					id=this.mainTree[i]['id'];
					break;
				}
				i++;
			}
		}

		var f='';
		var p=[];
		p[0]=id;
		p[1]=email;
		p[2]=name;
		p[3]=message;
		p[4]='0';

		this.modalbox.hide();
		this.runFunction('doSendEmail', p, 'Send file to &nbsp; '+ email +'<br><br>Please wait...', 'doEmailResp();');
		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.doEmailResp=function(id, name, description, tags){
		Ext.Msg.alert('Success', 'Success');

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.beforeDrop=function(id1, id2){
		var background=0;
		var provider1=0;
		var provider2=0;

		var i=0;
		while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
			if( this.mainTree[i]["id"]==id2 ){
				provider2=this.mainTree[i]["provider"];
				if( this.mainTree[i]["type"]==1 ){
					id2=this.mainTree[i]["id"];
				}

				if( this.mainTree[i]["type"]==0 ){
					if(  this.mainTree[i]["pid"].indexOf('__')>-1  ){
						id2=this.mainTree[i]["real_pid"];
					}else{
						id2=this.mainTree[i]["pid"];
					}
				}

				if( this.mainTree[i]["type"]==5 ){
					id2=this.mainTree[i]["pid"];
				}
			}

			if( this.mainTree[i]["id"]==id1 ){
				provider1=this.mainTree[i]["provider"];
				if( this.mainTree[i]["type"]!=0 ){
					return 0;
				}
			}

			i++;
		}//while

		if( (id2=='0') || (id2==0) ){
			return -1;
		}

		if( id1 == id2 ){
			return 0;
		}

		if( provider1 != provider2 ){
			background=1;
		}

		var thisObject=this;
		Ext.MessageBox.confirm('Move', 'Move this file?', function(btn){
			if (btn == 'yes') {
				thisObject.MoveFile(id1, id2, background);
			}
		});
	}
//------------------------------------------------------------------------------------------
	prototype.MoveFile=function(id1, id2, background){
		var p=[];
		p[0]=id1;
		p[1]=id2;

		if( background==0 ){
			f='doMoveFiles';
		}else{
			f='doMoveFilesInBackground';
		}

		this.runFunction(f, p, 'Move file<br><br>Please wait...', 'MoveFileResp("'+ id1 +'", "'+ id2 +'", "'+ background +'");');
	}
//------------------------------------------------------------------------------------------
	prototype.MoveFileResp=function(id1, id2, background){
		if( background!=1 ){
			var i=0;
			var L=0;
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if( (this.mainTree[i]["id"]==id2) && (this.mainTree[i]["loaded"]==1) ){
					L=1;
					break;
				}

				i++;
			}

			this.deleteElementFromPanel(this.treeId, id1, 1);

			i=0;
			var n;
			while(  (typeof(this.mainTree)!="undefined") && (typeof(this.mainTree[i])!="undefined")  ){
				if( this.mainTree[i]["id"]==id1 ){
					if( L==1 ){
						this.mainTree[i]["pid"]=id2;
						this.addElementToPanel(this.treeId, this.mainTree[i], this.mainTree[i]["pid"]);
					}else{
						this.mainTree[i]=this.mainTree[this.mainTree.length-1];
						this.mainTree.length--;
					}
					break;
				}
				i++;
			}

			return 0;
		}else{
			this.deleteElementFromPanel(this.treeId, id1);

			this.synchronizeMenu();
			if(  this.showMessageMoveFilesInBackground == 1  ){
				this.ShowModalboxMoveFilesInBackground();
			}

			return 0;
		}
	}
//------------------------------------------------------------------------------------------
	prototype.ShowModalboxMoveFilesInBackground=function(){
		var caption='Move Files In Background';
		var html_header = '<div class="x-window-header">'+ caption +'</div>';
		var html='';

		html+= '<table border="0" cellpadding="3" cellspacing="7" align="center" class="SMEStorageFMModalbox">';
		html+= '	<tr>';
		html+= '		<td>Your file is moved as a background process. Please refresh in a few moments if you wish to see the file in its new location.</td>';
		html+= '	</tr>';
		html+= '	<tr>';
		html+= '		<td><label><input type="checkbox" value="0" checked="checked" id="showMessageMoveFilesInBackground"> Show this message again?</label></td>';
		html+= '	</tr>';
		html+= '</table>';

		document.getElementById('SMEStorageFMModalbox').innerHTML = html_header;

		var win = new Ext.Window({
			applyTo:'SMEStorageFMModalbox',
			layout:'fit',
			x:0,
			y:0,

			width:350,
			height:175,
			closeAction:'hide',
			plain: true,
			modal: true,

			items: [{
				html: html
			}],

			buttons: [{
				text:'OK',
				handler: function(){
					if(  document.getElementById("showMessageMoveFilesInBackground").checked  ){
						SMEStorageFM.showMessageMoveFilesInBackground=1;
					}else{
						SMEStorageFM.showMessageMoveFilesInBackground=0;
					}
					SMEStorageFM.modalbox.hide();
				}
			},{
				text: 'Cancel',
				handler: function(){
					SMEStorageFM.modalbox.hide();
				}
			}]
		});

		win.show(this);

		SMEStorageFM.modalbox=win;
	}
//------------------------------------------------------------------------------------------


//==========================================================================================
// Functions for sending requests to server
//==========================================================================================
// name - name API function
// p - parameters
// msg - message for modalbox
// func - prototype.which needs to be caused after a request.
	prototype.runFunction=function(name, p, msg, func){
		if(  this.waitResult!=0  ){
			if(  name.indexOf('gettoken')==-1  ){
				this.timerID=setTimeout("SMEStorageFM.runFunction('"+ name +"', '"+ p +"', '"+ msg +"', '"+ func +"')", 100);
			}
			return -1;
		}

		if(  (typeof(this.rqP)!="undefined") && (typeof(this.rqP[0])!="undefined") && (name!="gettoken")  ){
			p=this.rqP;
		}

		var token=this.userInfo['token'];
		if( name.indexOf('gettoken')>-1 ){
			token='*';
		}

		var url=this.server_sme_api+'/'+token+'/'+name+'/';
		var L=0;
		var i=0;
		while(  (typeof(p)!="undefined") && (typeof(p[i])!="undefined")  ){
			if(  L!=0  ){
				url += ',';
			}else{
				L=1;
			}

			if( (typeof(p[i])!='string') ){
				p[i]=p[i]+'';
			}
			url+=this.encode64(p[i]);

			i++;
		}

		url=this.encode64(url);
		url=this.script_for_resend_request + url;

		if(  (name.indexOf('gettoken')==-1) && (token=='*')  ){
			this.waitResult=0;
			this.signIn(1);
			this.rqP=p;

			this.timerID=setTimeout("SMEStorageFM.runFunction('"+ name +"', '"+ p +"', '"+ msg +"', '"+ func +"')", 100);
//			this.timerID=setInterval("SMEStorageFM.runFunction('"+ name +"', '"+ p +"', '"+ msg +"', '"+ func +"')", 100);
			return 0;
		}

		this.sendRequestToServer(name, p, url, msg, func);
	}
//------------------------------------------------------------------------------------------
	prototype.sendRequestToServer=function(name, p, url, msg, func){
		this.waitResult2=1;

		if(  this.timerID>0  ){
			clearInterval(this.timerID);
			this.timerID='';
		}

		this.waitResult=1;
		this.responseData='';
		if( (typeof(msg)!="undefined") && (msg.length>0) && (msg!="undefined") ){
			Ext.get('mainTreeFileManagerBorder').mask(msg);
		}

		if( func.indexOf(this.externalName)==-1 ){
			func = this.externalName +'.'+ func;
		}

		Ext.Ajax.request({
			 url : url,
			 params : {},
			 maskEl : 'mainTreeFileManagerBorder',
			 func : func,
			 name : name,
			 p : p
		});

		return 0;
	}
//------------------------------------------------------------------------------------------
	prototype.ajaxResponse=function(conn, response, options){
		if( this.waitResult2==0 ){
			return null;
		}

		this.waitResult2=0;

		if(  options.func.indexOf('signInResp')==-1  ){
			this.waitResult=0;
			this.rqP='';
		}

		try{
			response.responseJSON = Ext.util.JSON.decode(response.responseText);
		}catch(e){
			response.responseJSON = false;
			Ext.get(options.maskEl).unmask();
			Ext.Msg.alert('Error', 'Server return not valid result.');
			return -3;
		}

		if( response.responseJSON ){
			if( response.responseJSON.error ){
				Ext.get(options.maskEl).unmask();
				clearInterval(this.timerID);
				this.timerID='';
				Ext.Msg.alert('Error', 'Error 101. Server not return result.');
				return -1;
			}
		}else{
			Ext.get(options.maskEl).unmask();
			clearInterval(this.timerID);
			this.timerID='';
			Ext.Msg.alert('Error', 'Error 102. Server not return result.');
			return -2;
		}

		if(  (typeof(response.responseJSON['status'])=="undefined")  ){
			Ext.get(options.maskEl).unmask();
			clearInterval(this.timerID);
			this.timerID='';
			Ext.Msg.alert('Error', 'Server not return status.');
			return -4;
		}

		if(  (response.responseJSON['status']=='login_token_expired') || (response.responseJSON['status']=='login_fail')  ){
			if(  options.func.indexOf('signInResp')==-1  ){
				if(  this.timerID>0  ){
					clearInterval(this.timerID);
					this.timerID='';
				}

				this.signIn();
				this.rqP=options.p;
				this.timerID=setTimeout("SMEStorageFM.runFunction('"+ options.name +"', '"+ options.p +"', '"+ options.msg +"', '"+ options.func +"')", 100);
//				this.timerID=setInterval("SMEStorageFM.runFunction('"+ options.name +"', '"+ options.p +"', '"+ options.msg +"', '"+ options.func +"')", 100);
				return 0;
			}

			Ext.get(options.maskEl).unmask();
			Ext.Msg.alert('Error', 'Login token expired.');
			return -5;
		}

		if(  (response.responseJSON['status'] != 'ok')  ){
			if(  (typeof(response.responseJSON['statusmessage'])!="undefined") && (response.responseJSON['statusmessage'].length>0)  ){
				Ext.get(options.maskEl).unmask();
				Ext.Msg.alert('Error', response.responseJSON['statusmessage']);
				return -6;
			}

			Ext.get(options.maskEl).unmask();
			Ext.Msg.alert('Error', 'Error');
			return -6;
		}

		this.responseData=response.responseJSON;
		setTimeout(options.func, 1);

		if(  options.func.indexOf('signInResp')==-1  ){
			Ext.get(options.maskEl).unmask();
		}

		return 0;
	}
//==========================================================================================
// Functions for use base64
//==========================================================================================
	prototype.encode64=function(input){
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output='';
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output+=keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
		}
		return output;
	}
//------------------------------------------------------------------------------------------
	prototype.decode64=function(input) {
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output ='';
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output +=(String.fromCharCode(chr1));

			if (enc3 != 64) {
				output +=(String.fromCharCode(chr2));
			}
			if (enc4 != 64) {
				output +=(String.fromCharCode(chr3));
			}
		}
		return output;
	}
//==========================================================================================
	}

var SMEStorageFM;
Ext.onReady(function(){

	SMEStorageFM = new SMEStorageFileManager();
	SMEStorageFM.externalName='SMEStorageFM';

	setTimeout("SMEStorageFM.searchMainTree();", 250);
//------------------------------------------------------------------------------------------------------------------------------------
	Ext.Ajax.on('requestexception', function (conn, response, options) {
		if(  (typeof(options.func)!="undefined") && (options.func.indexOf('SMEStorageFM')!=-1)  ){
			SMEStorageFM.ajaxResponse(conn, response, options);
			return 0;
		}


	});
//------------------------------------------------------------------------------------------------------------------------------------
	Ext.Ajax.on('requestcomplete', function (conn, response, options) {
		if(  (typeof(options.func)!="undefined") && (options.func.indexOf('SMEStorageFM')!=-1)  ){
			SMEStorageFM.ajaxResponse(conn, response, options);
			return 0;
		}


	});
//------------------------------------------------------------------------------------------------------------------------------------

});
