export enum Priority {
    alta = "Alta",
    urgente = "Urgente",
    normal = "normal",
    baixa = "Baixa",
    minima = "Mínima"
}

const priorityColorMap: { [key in Priority]: string } = {
    [Priority.urgente]: 'failure',
    [Priority.alta]: 'warning',
    [Priority.normal]: 'indigo',
    [Priority.baixa]: 'success',
    [Priority.minima]: 'secondary'
};

export const getPriorityColor = (priority: Priority): string => {
    return priorityColorMap[priority] || 'white'
}