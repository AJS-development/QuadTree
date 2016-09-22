// No license! you are free to use. But please keep this link (https://github.com/AJS-development/QuadTree) so others can also use this

var QTree = class QTree{
  
  constructor(bounds,maxobj,maxlevl,level,parent,master,id) {
  this.bounds = bounds;
    this.neighbors = [];
  this.maxobj = maxobj
  this.maxlevl = maxlevl;
  this.master = (master) ? master : this;
  this.level = level
  this.parent = parent;
      this.allnodes = new QuickMap();
      this.nodes = new QuickMap();
      this.child = [];
      this.id = id;
  }
  get(id) {
    return this.nodes.get(id);
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
    
    delete(node) {
        this.master.allnodes.delete(node.id)
     if (node.QTree) {
         node.QTree.remove(node)
     }
    }
    remove(node) {
        
        this.nodes.delete(node.id)
        node.QTree = false;
    }
    pres(bound) {
        if (bound.x > this.bound.x || bound.x + bound.width > this.bound.x || bound.y > this.bound.y || bound.y + bound.height > this.bound.y) return true;
        return false;
    }
    clear() {
    this.nodes.clear();
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
        var nodes = new QuickMap()
          if (!this.child[0]) return this.nodes;
        for (var i = 0; i < this.child.length; i ++) {
            if (this.child[i].pres(bounds)) {
                nodes.concat(this.child[i].getWithMerged())
            }
        }
        return nodes;
    }
    
  insert(node) {
      if (this.level == 0) this.allnodes.set(node.id,node)
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
          this.nodes.set(node.id,node)
      if (this.nodes.length > this.maxobj && this.level < this.maxlevl) {
          if (!this.child[0]) this.split()
          this.nodes.forEach((n)=>{
              var ind = this.getIndex(n.bounds);
              if (ind != -1) this.child[ind].insert(n)
          })
          
      }
  }
  
}
