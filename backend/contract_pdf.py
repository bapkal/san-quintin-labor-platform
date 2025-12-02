"""
PDF Contract Generator
Generates official employment contracts for workers that can be used for government benefits.
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
from io import BytesIO
from typing import Dict, Any, Optional


def generate_contract_pdf(
    contract_data: Dict[str, Any],
    job_data: Dict[str, Any],
    worker_data: Dict[str, Any],
    grower_data: Optional[Dict[str, Any]] = None
) -> BytesIO:
    """
    Generate a PDF contract document for a worker.
    
    Args:
        contract_data: Contract information (id, status, created_at, etc.)
        job_data: Job details (title, pay_rate_mxn, start_date, description, etc.)
        worker_data: Worker information (name, phone, user_id)
        grower_data: Grower/farm information (farm_name, location, etc.)
    
    Returns:
        BytesIO object containing the PDF
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.75*inch, bottomMargin=0.75*inch)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=10
    )
    
    # Title
    elements.append(Paragraph("CONTRATO DE TRABAJO AGRÍCOLA", title_style))
    elements.append(Paragraph("AGRICULTURAL EMPLOYMENT CONTRACT", styles['Normal']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Contract Information
    contract_date = datetime.now().strftime("%d de %B de %Y")
    elements.append(Paragraph(f"<b>Fecha del Contrato / Contract Date:</b> {contract_date}", normal_style))
    elements.append(Paragraph(f"<b>Número de Contrato / Contract Number:</b> {contract_data.get('id', 'N/A')}", normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Parties Section
    elements.append(Paragraph("<b>PARTES / PARTIES</b>", heading_style))
    
    # Worker Information
    worker_name = worker_data.get('name', 'Worker Name Not Available')
    worker_phone = worker_data.get('phone', 'N/A')
    worker_id = worker_data.get('user_id', 'N/A')
    
    elements.append(Paragraph("<b>TRABAJADOR / WORKER:</b>", normal_style))
    elements.append(Paragraph(f"Nombre / Name: {worker_name}", normal_style))
    elements.append(Paragraph(f"Teléfono / Phone: {worker_phone}", normal_style))
    elements.append(Paragraph(f"ID: {worker_id}", normal_style))
    elements.append(Spacer(1, 0.15*inch))
    
    # Employer Information
    farm_name = grower_data.get('farm_name', 'Agricultural Employer') if grower_data else 'Agricultural Employer'
    location = grower_data.get('location', 'San Quintín, Baja California') if grower_data else 'San Quintín, Baja California'
    
    elements.append(Paragraph("<b>EMPLEADOR / EMPLOYER:</b>", normal_style))
    elements.append(Paragraph(f"Nombre de la Granja / Farm Name: {farm_name}", normal_style))
    elements.append(Paragraph(f"Ubicación / Location: {location}", normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Job Details
    elements.append(Paragraph("<b>DETALLES DEL TRABAJO / JOB DETAILS</b>", heading_style))
    
    job_title = job_data.get('title', 'Agricultural Work')
    pay_rate = float(job_data.get('pay_rate_mxn', 0))
    unit_type = job_data.get('unit_type', 'unit')
    start_date = job_data.get('start_date', 'TBD')
    crop_type = job_data.get('crop_type', 'Agricultural')
    workers_requested = job_data.get('workers_requested', 1)
    description = job_data.get('description', 'Agricultural work as described')
    
    # Job details table
    job_table_data = [
        ['Campo / Field', 'Valor / Value'],
        ['Título del Trabajo / Job Title', job_title],
        ['Tipo de Cultivo / Crop Type', crop_type],
        ['Fecha de Inicio / Start Date', start_date],
        ['Pago / Pay Rate', f"${pay_rate:.2f} MXN / {unit_type}"],
        ['Trabajadores Solicitados / Workers Requested', str(workers_requested)],
    ]
    
    job_table = Table(job_table_data, colWidths=[3*inch, 4*inch])
    job_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e5e7eb')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(job_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Terms and Conditions
    elements.append(Paragraph("<b>TÉRMINOS Y CONDICIONES / TERMS AND CONDITIONS</b>", heading_style))
    
    terms = [
        "El trabajador acepta realizar el trabajo agrícola descrito anteriormente bajo los términos acordados.",
        "The worker agrees to perform the agricultural work described above under the agreed terms.",
        "",
        "El pago se realizará según la tarifa especificada y el trabajo completado.",
        "Payment will be made according to the specified rate and completed work.",
        "",
        "Este contrato es válido para propósitos de documentación laboral y beneficios gubernamentales.",
        "This contract is valid for labor documentation and government benefits purposes.",
        "",
        "El trabajador tiene derecho a condiciones de trabajo seguras y justas según las leyes laborales mexicanas.",
        "The worker has the right to safe and fair working conditions according to Mexican labor laws.",
    ]
    
    for term in terms:
        if term:
            elements.append(Paragraph(term, normal_style))
        else:
            elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Spacer(1, 0.3*inch))
    
    # Agreement Statement
    elements.append(Paragraph(
        "<b>DECLARACIÓN DE ACUERDO / AGREEMENT STATEMENT</b>",
        heading_style
    ))
    
    agreement_text = (
        f"Por la presente, {worker_name} (Trabajador / Worker) y {farm_name} (Empleador / Employer) "
        f"acuerdan los términos y condiciones establecidos en este contrato. "
        f"El trabajador acepta el trabajo descrito y el empleador se compromete a proporcionar "
        f"el pago acordado por el trabajo realizado."
    )
    
    elements.append(Paragraph(agreement_text, normal_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Signatures Section
    signature_table_data = [
        ['', ''],
        ['_________________________', '_________________________'],
        ['Firma del Trabajador', 'Firma del Empleador'],
        ['Worker Signature', 'Employer Signature'],
        ['', ''],
        [f'Fecha: {contract_date}', f'Fecha: {contract_date}'],
    ]
    
    signature_table = Table(signature_table_data, colWidths=[3.5*inch, 3.5*inch])
    signature_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 20),
    ]))
    elements.append(signature_table)
    
    elements.append(Spacer(1, 0.2*inch))
    
    # Footer
    footer_text = (
        "Este documento es un contrato de trabajo oficial que puede ser utilizado para "
        "propósitos de documentación laboral, beneficios gubernamentales, y verificación de empleo. "
        "This document is an official employment contract that can be used for labor documentation, "
        "government benefits, and employment verification purposes."
    )
    
    elements.append(Paragraph(footer_text, ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER,
        fontStyle='italic'
    )))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer

