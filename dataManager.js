// data-binding.js

let originalData = {
    expansionPerMiliSecond : 7.4,
    totalExpansion : 0,
    totalExpansionAfterJoin : 0,
}

let renderFunctionsByIndex = {}

function getProxyByTable(t) {
    let proxy = new Proxy(t, {
        get(obj, prop){
            return obj[prop]
        },
        set(obj, prop, val){
            obj[prop] = val
            if (renderFunctionsByIndex[prop]) {
                renderFunctionsByIndex[prop].forEach((renderFunction)=>{
                    renderFunction()
                })
            }
        }
    })
    return proxy
}

let data = getProxyByTable(originalData)

/*값 바꿀땐 data[인덱스] = 값*/


let dataHtmls = document.querySelectorAll('[data-bind]')
dataHtmls.forEach((dataHtml) => {
    let attribute = dataHtml.getAttribute('data-bind')
    console.log(attribute,"소환됨")
    if (renderFunctionsByIndex[attribute] == null) {
        renderFunctionsByIndex[attribute] = []
    }
    if (renderFunctionsByIndex[attribute] == undefined) {
        renderFunctionsByIndex[attribute] = []
    }
    function render() {
        let resultData = data[attribute]

        if (typeof(resultData) == "number") {
            resultData = Math.round(resultData*1000)/1000
        }

        dataHtml.innerText = resultData
    }
    renderFunctionsByIndex[attribute].push(
        render
    )
    render()
});

let date = new Date

/*425797981376593700..904602982 + (date.getTime()*data.expansionPerMiliSecond*10) */
data.totalExpansion = 104602982 + (date.getTime()*data.expansionPerMiliSecond*10)

function addTotalExpansions() {
    data.totalExpansion += data.expansionPerMiliSecond
    data.totalExpansionAfterJoin += data.expansionPerMiliSecond
}

setInterval(addTotalExpansions, 100);