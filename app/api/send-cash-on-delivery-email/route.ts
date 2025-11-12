import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  // Check for API key - return success even if not set to prevent blocking
  if (!process.env.RESEND_API_KEY) {
    console.warn('[API] RESEND_API_KEY is not set - email will not be sent');
    return NextResponse.json(
      {
        message: 'Email service not configured - order data logged',
        warning: true
      },
      { status: 200 } // Return 200 to not block the page
    );
  }

  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      postalCode,
      econtOffice,
      comment,
      items,
      total
    } = body;

    // Validation
    if (!email || !firstName || !lastName || !items || items.length === 0) {
      console.error('[API] Validation failed - missing required fields');
      return NextResponse.json(
        {
          message: 'Error: Missing required fields'
        },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Format products list
    const productsList = items
      .map((item: any) => {
        const childNameText = item.childName ? ` - Име на детето: ${item.childName}` : '';
        return `<li>${item.name}${childNameText} - Количество: ${item.quantity} - Цена: ${(item.price * item.quantity / 100).toFixed(2)} евро.</li>`;
      })
      .join('');

    // Format HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; margin-bottom: 10px;">S&F Art</h1>
        <h2 style="color: #333; border-bottom: 2px solid #FF6B35; padding-bottom: 10px;">
          Нова поръчка - Наложен платеж + EasyPay
        </h2>
        <p style="color: #FF6B35; font-size: 18px; font-weight: bold; margin: 20px 0;">
          Човек избра наложен платеж + EasyPay
        </p>
        
        <h3 style="color: #555; margin-top: 20px;">Информация за клиента:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Име:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Имейл:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Телефон:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone || 'Не е посочен'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Град:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${city || 'Не е посочен'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Пощенски код:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${postalCode || 'Не е посочен'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Адрес на офис на еконт:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${econtOffice || 'Не е посочен'}</td>
          </tr>
          ${comment ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Коментар:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${comment.replace(/\n/g, '<br>')}</td>
          </tr>
          ` : ''}
        </table>

        <h3 style="color: #555; margin-top: 20px;">Поръчани продукти:</h3>
        <ul style="list-style: none; padding: 0;">
          ${productsList}
        </ul>

        <div style="margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">
            Обща сума: <span style="color: #FF6B35;">${(total / 100).toFixed(2)} евро.</span>
          </p>
        </div>

        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          Дата на поръчката: ${new Date().toLocaleString('bg-BG')}
        </p>
      </div>
    `;

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'avoex@resend.dev';
    const toEmail = process.env.RESEND_TO_EMAIL || 'avoex.contact@gmail.com';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `S&F Art - Нова поръчка (Наложен платеж + EasyPay) от ${firstName} ${lastName}`,
      html: htmlContent,
    });

    if (error) {
      console.error('[API] Resend error:', error);
      return NextResponse.json(
        {
          message: 'Error sending email',
          error: error
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Email sent successfully',
        emailId: data?.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      {
        message: 'Error',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Use POST to send cash on delivery email'
  });
}

