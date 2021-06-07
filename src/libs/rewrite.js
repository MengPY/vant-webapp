const iview= {
    table: {
        selectAll(status) {
            for (const data of this.rebuildData) {
                const objData = this.objData[data._index]
                if (!objData._isDisabled) {
                    objData._isHighlight = status
                    objData._isChecked = status
                }
                if (data.children && data.children.length) {
                    this.selectAllChildren(objData, status)
                }
            }
            const selection = this.getSelection()
            if (status) {
                this.$emit("on-select-all", selection)
            } else {
                this.$emit("on-select-all-cancel", selection)
            }
            this.$emit("on-selection-change", selection)
        },
        toggleSelect(_index, rowKey) {
            let data = {}
            if (rowKey) {
                data = this.getDataByRowKey(rowKey)
            } else {
                for (let i in this.objData) {
                    if (parseInt(i) === _index) {
                        data = this.objData[i]
                        break
                    }
                }
            }
            const status = !data._isChecked
            data._isHighlight = status
            data._isChecked = status
            const selection = this.getSelection()
            const selectedData = rowKey ? this.getBaseDataByRowKey(rowKey, this.data) : this.data[_index]
            this.$emit(status ? "on-select" : "on-select-cancel", selection, JSON.parse(JSON.stringify(selectedData)))
            this.$emit("on-selection-change", selection)
        },
    },
}
const fn = {
    iview
}
const rewriteIview=(iView)=>{
    iView.Table.props.highlightRow.default = true//iview表格默认点击高亮
    // iView.Table.methods.toggleSelect = fn.iview.table.toggleSelect
    // iView.Table.methods.selectAll = fn.iview.table.selectAll
}
export default fn
export {
    iview,
    rewriteIview,
}