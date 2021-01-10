  
export const roundToDecimal = (num: number,decimalplace: number) : string => {   

    function numberWithCommas(x: number) {
        return x.toString().replace(/\B(?!=\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    let result: any = num + `e+${decimalplace}`
    let dec =  +(Math.round(result)  + `e-${decimalplace}`);
    let finddecimal = /\./
    let test = finddecimal.test(dec.toString())
    return test ? numberWithCommas(dec) : `${numberWithCommas(dec)}.00`

}


const MonthArray: Array<string> = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

export const formatBdayDate = (Bday: Date): string =>{
    if(Bday == null) return ""
    var Bdate = new Date(Bday)
    return `${MonthArray[Bdate.getMonth()]} ${Bdate.getDate()}, ${Bdate.getFullYear()}`
} 

export const formatHour = (hour: Date): string =>{
    if(hour == null) return "00:00"
    const hournew = new Date(hour)
    // const hourdata = new Date(hournew-(60*1000*480) )
    const hourdata = hournew
    const _hour = `0${hourdata.getHours()}`
    const _minute = `0${hourdata.getMinutes()}`
    return `${_hour.slice(-2)}:${_minute.slice(-2)}`
}

export const format12Hour = (hour: Date): string=>{
    let formattedhour = formatHour(hour)
    let rawhour: Array<string> = formattedhour.split(":")
    let finalhour
    if(+rawhour[0] == 12){
        return `${formattedhour} pm`
    }
    else if(+rawhour[0] > 12){
            finalhour = +rawhour[0] - 12
            return `${finalhour}:${rawhour[1]} pm`
    }else if(parseInt(rawhour[0])==0){
        finalhour = 12
        return `${finalhour}:${rawhour[1]} am`
    }else{
        return `${formattedhour} am`
    }

}

export const generatePin = (length: number) => {
    let a: number | string = Math.ceil(100000 + (Math.random()*900000))
    a = a.toString().substring(0, length);
    return a
}

export const HaversineCalculateDistance = () => {
    function calculateDistance(lat1: number , lon1: number , lat2: number ,lon2: number){
		var R = 6371 * 1000 // in meters radius of earth
		var x1 = lat2-lat1
		var dLat = x1 * Math.PI / 180
		var x2 = lon2 - lon1
		var dLon = x2 * Math.PI / 180
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // in metres
        return d
    }

    function calculateDistance_Formula2(lat1: number , lon1: number , lat2: number ,lon2: number){

		function radians(value: number){
			return value * Math.PI / 180
		}

		var R = 6371 * 1000 // in meters radius of earth
		let c = Math.cos(radians(lat1)) * Math.cos(radians(lat2))
		        * Math.cos(radians(lon2) - radians(lon1)) + Math.sin(radians(lat1))
		        * Math.sin(radians(lat2))
		c = Math.acos(c)
		var d =  R * c
		return d
	}

    
    let sampleboundaryCirleRadius: number = 1000

	let distance = calculateDistance(14.522697701286344, 121.05664863314786 ,14.531671050980467, 121.07677592883292)
	console.log(distance)

	if(distance > sampleboundaryCirleRadius){
		console.log("lagpas")
	}else{
		console.log("nasa loob pa")
	}

	let distance2 = calculateDistance(14.522697701286344, 121.05664863314786 ,14.519934999488068, 121.06308593453967)
	console.log(distance2)

	if(distance2 > sampleboundaryCirleRadius){
		console.log("lagpas")
	}else{
		console.log("nasa loob pa")
	}
}