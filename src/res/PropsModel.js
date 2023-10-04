import PipeTypeNSize from './PipeTypeNSize.json'
import WoodenSheetType from './WoodenSheetType.json'
import WoodTapeSize from './WoodTapeSize.json'
import MiscItemSize from './MiscItemSize.json'

const PropsModel = {
    ironPipeRows: {
        pipeTypeNSize: `${PipeTypeNSize[0].Type}  ${PipeTypeNSize[0].Size}`,
        length: '',
        qty: ''
    },
    woodenSheetRows: {
        type: WoodenSheetType[0].Type,
        length: '',
        width: '',
        qty: ''
    },
    woodTapeRows: {
        size: WoodTapeSize[0].Size,
        length: '',
        qty: ''
    },
    miscTableRows: [
        {
            item: "Wheels",
            size: MiscItemSize[0].Size,
            qty: ''
        },
        {
            item: "Cross Rods",
            size: MiscItemSize[0].Size,
            qty: ''
        },
        {
            item: "Guaze",
            size: MiscItemSize[0].Size,
            qty: ''
        },
        {
            item: "Realing",
            size: MiscItemSize[0].Size,
            qty: ''
        },
        {
            item: "Wooden Legs",
            size: MiscItemSize[0].Size,
            qty: ''
        },
        {
            item: "Handles",
            size: MiscItemSize[0].Size,
            qty: ''
        },
        {
            item: "Box",
            size: MiscItemSize[0].Size,
            qty: ''
        },
        {
            item: "Wooden Piller",
            size: MiscItemSize[0].Size,
            qty: ''
        },
        {
            item: "Steel Piller",
            size: MiscItemSize[0].Size,
            qty: ''
        }
    ]
}

export default PropsModel;