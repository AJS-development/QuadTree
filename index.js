"use strict";
// No license! you are free to use. 
// But please keep this link (https://github.com/AJS-development/QuadTree) so others can also use this

var QTree = class QTree{
  
  constructor(bounds,maxobj,maxlevl,level,parent,master,id) {
  this.bounds = bounds;
    this.neighbors = [];
  this.maxobj = (maxobj) ? maxobj : 4
  this.maxlevl = (maxlevl) ? maxlevl : 10;
  this.master = (master) ? master : this;
  this.level = (level) ? level : 0
  
  this.parent = parent;
      this.allnodes = []
      this.nodes = []
      this.child = [];
      this.id = id;
  }
  getNodesRecur() {
    var nodes = [];
    nodes.concat(this.nodes)
    for (var i in this.child) nodes.concat(this.child[i].getNodesRecur())
    return nodes
  }
  getNodesRecurLength() {
    var len = 0;
    len += this.nodes.length;
    for (var i in this.child) len += this.child[i].getNodesRecurLength() 
    return len
  }
 resortBranch() {
   var nodes = this.getNodesRecur;
   this.child = []
   nodes.forEach((node)=>{
     this.insert(node)
   })
 }
  getNodes() {
    return this.nodes;
  }
  getQuad(bounds) {
    var ind = this.getIndex(bounds)
    if (ind != -1) {
      return this.child[ind].getQuad(bounds)
      
    }
    return this;
    
  }
    doesFit(bounds) {
        if (bounds.x < this.bounds.x || bounds.y < this.bounds.y || bounds.x + bounds.width > this.bounds.x + this.bounds.width || bounds.y + bounds.height > this.bounds.y + this.bounds.height) return false
        return true;
    }
    getIndex(bounds) {
       
        var ver = this.bounds.x + (this.bounds.width/2)
        var hor = this.bounds.y + (this.bounds.height/2)
        var top = ((bounds.y < hor) && (bounds.y + bounds.height < hor))
        var bot = (bounds.y > hor)
        var ind = -1
        if (bounds.x < ver && bounds.x + bounds.width < ver) {
            if (top) {
                ind = 1
            } else if (bot) {
                ind = 2
            }
        } else if (bounds.x > ver) {
            if (top) {
                ind = 0;
            } else if (bot) {
                ind = 3
            }
            
        }
        return ind;
        }
    split() {
        var wid = this.bounds.width/2
        var hei = this.bounds.height/2
        
        this.child[0] = new QTree({width: wid, height: hei, x: x + wid, y: y},this.maxobj,this.maxlvl,this.level + 1,this,this.master,0)
        this.child[1] = new QTree({width: wid, height: hei, x: x, y: y},this.maxobj,this.maxlvl,this.level + 1,this,this.master,1)
        this.child[2] = new QTree({width: wid, height: hei, x: x, y: y + hei},this.maxobj,this.maxlvl,this.level + 1,this,this.master,2)
        this.child[3] = new QTree({width: wid, height: hei, x: x + wid, y: y + hei},this.maxobj,this.maxlvl,this.level + 1,this,this.master,3)
    }
    checkForMax() {
      if (this.child[0]) {
        return;
        
      } else
      if (this.objects.length > this.maxobj) {
        this.split();
        this.nodes.forEach((n)=>{
              var ind = this.getIndex(n.bounds);
              if (ind != -1) this.child[ind].insert(n)
          })
      }
    }
    checkForMin() {
      if (!this.child[0]) return;
     var nodes = this.getNodesRecur();
      if (nodes.length > this.maxobj) return;
      this.resortBranch()
    }
    balance(a) {
     if (!a) this.checkForMax()
      this.checkForMin()
      this.child.forEach((c)=>{
        c.balance()
      })
    }
    delete(node) {
      var ind = this.master.allnodes.indexOf(node)
        if (ind != -1) this.master.allnodes.splice(ind,1)
     if (node.QTree) {
      
         node.QTree.remove(node)
     }
     
    }
    remove(node) {
         var ind = this.nodes.indexOf(node)
        if (ind != -1) this.nodes.splice(ind,1)
        node.QTree.parent.balance(true)
        node.QTree = false;
    }
    pres(bound) {
        if (bound.x > this.bound.x || bound.x + bound.width > this.bound.x || bound.y > this.bound.y || bound.y + bound.height > this.bound.y) return true;
        return false;
    }
    clear() {
    this.nodes = [];
        for (var i in this.child) {
            this.child[i].clear();
            this.child[i] = false;
        }
    }
    getWithMerged(bounds) {
      
        /*
        2    ____|__       1
            |    |  | <- Returns quadrant 1 and 2
            |____|__|
                 |
        ---------|----------
                 |
                 |
        3        |         4
        */
        var nodes = []
          if (!this.child[0]) return this.nodes;
        for (var i = 0; i < this.child.length; i ++) {
            if (this.child[i].pres(bounds)) {
                nodes.concat(this.child[i].getWithMerged())
            }
        }
        return nodes;
    }
    
  insert(node) {
      if (this.level == 0 && this.allnodes.indexOf(node) == -1) this.allnodes.push(node)
      if (child[0]) {
      var index = this.getIndex(node.bounds)
      if (index != -1) {
          this.child[index].insert(node)
          return;
      }
      }
      if (node.QTree) node.QTree.remove(node)
      if (node.QTree) throw "Node cannot have two QTrees"
      node.QTree = this;
          this.nodes.push(node)
      if (this.nodes.length > this.maxobj && this.level < this.maxlevl) {
          if (!this.child[0]) this.split()
          this.nodes.forEach((n)=>{
              var ind = this.getIndex(n.bounds);
              if (ind != -1) this.child[ind].insert(n)
          })
          
      }
  }
  
}
module.exports = QTree
